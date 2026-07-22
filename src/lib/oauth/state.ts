import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const STATE_COOKIE = "oauth_state";
const ROLE_COOKIE = "oauth_role";
const MAX_AGE = 60 * 10; // 10 minutes — le temps de faire le tour du fournisseur

/**
 * Génère un jeton anti-CSRF pour le flux OAuth et le pose en cookie
 * httpOnly de courte durée. Le même jeton est envoyé au fournisseur en
 * paramètre `state` puis comparé au retour (callback) pour s'assurer que
 * la réponse correspond bien à une requête initiée par nous.
 */
export async function createOAuthState(role?: "CANDIDATE" | "RECRUITER") {
  const state = randomBytes(24).toString("hex");
  const cookieStore = await cookies();

  // `sameSite: none` est nécessaire en production pour d'authentifier après
  // un retour depuis un domaine tiers (notamment le formulaire POST d'Apple).
  const crossSite = process.env.NODE_ENV === "production";

  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? "none" : "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  if (role) {
    cookieStore.set(ROLE_COOKIE, role, {
      httpOnly: true,
      secure: crossSite,
      sameSite: crossSite ? "none" : "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
  }

  return state;
}

/** Vérifie le `state` renvoyé par le fournisseur contre le cookie posé au départ. */
export async function verifyOAuthState(receivedState: string | null) {
  const cookieStore = await cookies();
  const expected = cookieStore.get(STATE_COOKIE)?.value;
  const roleHint = cookieStore.get(ROLE_COOKIE)?.value as
    | "CANDIDATE"
    | "RECRUITER"
    | undefined;

  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(ROLE_COOKIE);

  const valid = !!expected && !!receivedState && expected === receivedState;
  return { valid, roleHint };
}
