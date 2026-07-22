import { SignJWT, importPKCS8, jwtVerify, createRemoteJWKSet } from "jose";
import type { OAuthProfile } from "./types";

const AUTHORIZE_URL = "https://appleid.apple.com/auth/authorize";
const TOKEN_URL = "https://appleid.apple.com/auth/token";
const ISSUER = "https://appleid.apple.com";

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/auth/keys`));

export function getAppleAuthorizeUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "form_post", // Apple ne renvoie qu'en POST
    scope: "name email",
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

/**
 * Le "client_secret" d'Apple n'est pas une chaîne statique : c'est un JWT
 * signé (ES256) avec la clé privée générée dans le portail développeur,
 * valable au maximum 6 mois. On le régénère à chaque appel, valable 5 min.
 */
async function buildAppleClientSecret() {
  const privateKeyPem = (process.env.APPLE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  );
  const privateKey = await importPKCS8(privateKeyPem, "ES256");

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID })
    .setIssuer(process.env.APPLE_TEAM_ID || "")
    .setIssuedAt()
    .setExpirationTime("5m")
    .setAudience(ISSUER)
    .setSubject(process.env.APPLE_CLIENT_ID || "")
    .sign(privateKey);
}

/**
 * @param code   Code d'autorisation renvoyé par Apple.
 * @param redirectUri  Doit être identique à celui envoyé à l'autorisation.
 * @param firstPartyUser  Le champ `user` (JSON) posté par Apple, présent
 *   uniquement lors de la toute première autorisation de ce compte.
 */
export async function fetchAppleProfile(
  code: string,
  redirectUri: string,
  firstPartyUser?: string | null
): Promise<OAuthProfile> {
  const clientSecret = await buildAppleClientSecret();

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.APPLE_CLIENT_ID || "",
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Apple token exchange failed: ${await tokenRes.text()}`);
  }
  const tokens = (await tokenRes.json()) as { id_token: string };

  const { payload } = await jwtVerify(tokens.id_token, JWKS, {
    issuer: ISSUER,
    audience: process.env.APPLE_CLIENT_ID || "",
  });

  let name: string | null = null;
  if (firstPartyUser) {
    try {
      const parsed = JSON.parse(firstPartyUser) as {
        name?: { firstName?: string; lastName?: string };
      };
      const full = [parsed.name?.firstName, parsed.name?.lastName]
        .filter(Boolean)
        .join(" ");
      name = full || null;
    } catch {
      // Champ absent ou mal formé : on continue sans nom.
    }
  }

  return {
    providerAccountId: String(payload.sub),
    email: (payload.email as string) ?? null,
    name,
    picture: null, // Apple ne fournit jamais de photo de profil
  };
}
