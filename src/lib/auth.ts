import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "horizon_session";
// Durée de vie de la session. Combinée au rafraîchissement glissant du
// proxy (src/proxy.ts), un utilisateur actif ne se déconnecte jamais.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours
export const SESSION_DURATION = "30d";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "horizon-dev-secret"
);
const COOKIE_NAME = SESSION_COOKIE;
const MAX_AGE = SESSION_MAX_AGE;

export type SessionPayload = {
  userId: string;
  role: "CANDIDATE" | "RECRUITER";
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Renvoie l'utilisateur complet connecté, ou null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}
