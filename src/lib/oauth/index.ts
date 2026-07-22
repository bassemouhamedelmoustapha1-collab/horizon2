import { prisma } from "@/lib/prisma";
import type { OAuthProviderId, OAuthProfile } from "./types";
import { getGoogleAuthorizeUrl, fetchGoogleProfile } from "./google";
import { getFacebookAuthorizeUrl, fetchFacebookProfile } from "./facebook";
import { getLinkedInAuthorizeUrl, fetchLinkedInProfile } from "./linkedin";
import { getAppleAuthorizeUrl, fetchAppleProfile } from "./apple";

export type { OAuthProviderId, OAuthProfile } from "./types";

export const OAUTH_PROVIDERS: OAuthProviderId[] = [
  "google",
  "apple",
  "facebook",
  "linkedin",
];

export const PROVIDER_LABELS: Record<OAuthProviderId, string> = {
  google: "Google",
  apple: "Apple",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

/** DB enum correspondant au slug utilisé dans les URLs. */
export function toDbProvider(provider: OAuthProviderId) {
  return provider.toUpperCase() as "GOOGLE" | "APPLE" | "FACEBOOK" | "LINKEDIN";
}

/**
 * Indique si les identifiants du fournisseur sont bien renseignés dans
 * l'environnement. Permet d'afficher un message clair plutôt que de
 * renvoyer l'utilisateur vers une page d'erreur du fournisseur.
 */
export function isProviderConfigured(provider: OAuthProviderId): boolean {
  const env = process.env;
  switch (provider) {
    case "google":
      return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
    case "facebook":
      return !!(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET);
    case "linkedin":
      return !!(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET);
    case "apple":
      return !!(
        env.APPLE_CLIENT_ID &&
        env.APPLE_TEAM_ID &&
        env.APPLE_KEY_ID &&
        env.APPLE_PRIVATE_KEY
      );
  }
}

export function getAuthorizeUrl(
  provider: OAuthProviderId,
  redirectUri: string,
  state: string
) {
  switch (provider) {
    case "google":
      return getGoogleAuthorizeUrl(redirectUri, state);
    case "facebook":
      return getFacebookAuthorizeUrl(redirectUri, state);
    case "linkedin":
      return getLinkedInAuthorizeUrl(redirectUri, state);
    case "apple":
      return getAppleAuthorizeUrl(redirectUri, state);
  }
}

/**
 * Échange le code d'autorisation contre un profil normalisé.
 * `appleUser` est le champ `user` posté par Apple (premher connexion
 * uniquement) ; ignoré par les autres fournisseurs.
 */
export async function fetchProfile(
  provider: OAuthProviderId,
  code: string,
  redirectUri: string,
  appleUser?: string | null
): Promise<OAuthProfile> {
  switch (provider) {
    case "google":
      return fetchGoogleProfile(code, redirectUri);
    case "facebook":
      return fetchFacebookProfile(code, redirectUri);
    case "linkedin":
      return fetchLinkedInProfile(code, redirectUri);
    case "apple":
      return fetchAppleProfile(code, redirectUri, appleUser);
  }
}

export type ResolveResult =
  | { status: "signed-in"; userId: string; role: "CANDIDATE" | "RECRUITER"; name: string }
  | { status: "needs-role" };

/**
 * Cherche un compte Horizon correspondant à ce profil social :
 * 1. Un compte déjà lié à ce fournisseur → connexion directe.
 * 2. Un compte existant avec le même e-mail (créé par mot de passe ou un
 *    autre fournisseur) → on lie ce nouveau fournisseur au même compte.
 * 3. Sinon → il faut demander le rôle (candidat/recruteur) avant de créer
 *    le compte (voir /register/complete).
 */
export async function resolveOAuthUser(
  provider: OAuthProviderId,
  profile: OAuthProfile
): Promise<ResolveResult> {
  const dbProvider = toDbProvider(provider);

  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: dbProvider,
        providerAccountId: profile.providerAccountId,
      },
    },
    include: { user: true },
  });
  if (existingAccount) {
    const { user } = existingAccount;
    return { status: "signed-in", userId: user.id, role: user.role, name: user.name };
  }

  if (profile.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (existingUser) {
      await prisma.oAuthAccount.create({
        data: {
          provider: dbProvider,
          providerAccountId: profile.providerAccountId,
          userId: existingUser.id,
        },
      });
      return {
        status: "signed-in",
        userId: existingUser.id,
        role: existingUser.role,
        name: existingUser.name,
      };
    }
  }

  return { status: "needs-role" };
}

/** Crée le compte Horizon + le lien OAuth pour un tout nouvel utilisateur. */
export async function createUserFromOAuth(args: {
  provider: OAuthProviderId;
  providerAccountId: string;
  email: string;
  name: string;
  picture: string | null;
  role: "CANDIDATE" | "RECRUITER";
  companyName?: string;
}) {
  const user = await prisma.user.create({
    data: {
      email: args.email,
      name: args.name,
      image: args.picture,
      role: args.role,
      companyName: args.role === "RECRUITER" ? args.companyName || args.name : null,
      oauthAccounts: {
        create: {
          provider: toDbProvider(args.provider),
          providerAccountId: args.providerAccountId,
        },
      },
    },
  });
  return user;
}
