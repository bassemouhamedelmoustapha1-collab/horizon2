import { cookies } from "next/headers";
import type { OAuthProviderId, OAuthProfile } from "./types";

const PENDING_COOKIE = "oauth_pending";
const MAX_AGE = 60 * 10;

interface PendingSignup {
  provider: OAuthProviderId;
  providerAccountId: string;
  email: string;
  name: string;
  picture: string | null;
}

/**
 * Stocke temporairement le profil d'un nouvel utilisateur social qui doit
 * encore choisir son rôle (candidat/recruteur) avant que son compte Horizon
 * ne soit créé. Rien de sensible : uniquement des informations que le
 * fournisseur a déjà transmises avec le consentement de l'utilisateur.
 */
export async function storePendingSignup(
  provider: OAuthProviderId,
  profile: OAuthProfile
) {
  if (!profile.email) {
    throw new Error(
      "Impossible de créer un compte sans adresse e-mail communiquée par le fournisseur."
    );
  }
  const payload: PendingSignup = {
    provider,
    providerAccountId: profile.providerAccountId,
    email: profile.email,
    name: profile.name || profile.email.split("@")[0],
    picture: profile.picture,
  };
  const cookieStore = await cookies();
  const crossSite = process.env.NODE_ENV === "production";
  cookieStore.set(PENDING_COOKIE, Buffer.from(JSON.stringify(payload)).toString("base64"), {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? "none" : "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function readPendingSignup(): Promise<PendingSignup | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PENDING_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export async function clearPendingSignup() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_COOKIE);
}
