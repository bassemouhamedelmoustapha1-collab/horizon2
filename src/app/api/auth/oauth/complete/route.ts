import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { readPendingSignup, clearPendingSignup } from "@/lib/oauth/pending";
import { createUserFromOAuth } from "@/lib/oauth";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
  companyName: z.string().optional(),
});

// POST /api/auth/oauth/complete — finalise la création du compte social
// une fois que l'utilisateur a choisi son rôle.
export async function POST(req: Request) {
  const pending = await readPendingSignup();
  if (!pending) {
    return NextResponse.json(
      { error: "Session d'inscription expirée. Recommencez la connexion." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }
  const { name, role, companyName } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email: pending.email },
  });
  if (existing) {
    await clearPendingSignup();
    return NextResponse.json(
      { error: "Cette adresse e-mail est déjà utilisée." },
      { status: 409 }
    );
  }

  const user = await createUserFromOAuth({
    provider: pending.provider,
    providerAccountId: pending.providerAccountId,
    email: pending.email,
    name,
    picture: pending.picture,
    role,
    companyName,
  });

  await clearPendingSignup();
  await createSession({ userId: user.id, role: user.role, name: user.name });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
    },
  });
}

// GET /api/auth/oauth/complete — pour préremplir le formulaire côté client.
export async function GET() {
  const pending = await readPendingSignup();
  if (!pending) {
    return NextResponse.json({ error: "Aucune inscription en attente." }, { status: 404 });
  }
  return NextResponse.json({
    name: pending.name,
    email: pending.email,
    picture: pending.picture,
    provider: pending.provider,
  });
}
