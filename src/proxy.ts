import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SESSION_DURATION,
} from "@/lib/auth";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "horizon-dev-secret"
);

/**
 * Proxy (ex-middleware, renommé dans Next 16). À chaque navigation, si une
 * session valide est présente, on ré-émet le jeton avec une nouvelle date
 * d'expiration : c'est un rafraîchissement « glissant ». Résultat : tant que
 * l'utilisateur revient dans les 30 jours, il n'a jamais à se reconnecter.
 * Un jeton absent ou expiré est simplement ignoré (l'utilisateur reste
 * déconnecté) ; le proxy ne bloque jamais la requête.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return response;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const refreshed = await new SignJWT({
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(SESSION_DURATION)
      .sign(SECRET);

    response.cookies.set(SESSION_COOKIE, refreshed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  } catch {
    // Jeton invalide/expiré : on n'y touche pas.
  }

  return response;
}

// On exclut les assets statiques et les routes API (qui gèrent elles-mêmes
// le cookie lors de la connexion/déconnexion). Le proxy ne s'exécute donc
// que sur les navigations de pages.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|icon.svg|uploads|companies).*)",
  ],
};
