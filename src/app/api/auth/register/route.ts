import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { findAndStoreCompanyLogo } from "@/lib/company-logo";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { name, email, password, role, companyName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Cette adresse e-mail est déjà utilisée." },
      { status: 409 }
    );
  }

  const resolvedCompanyName = role === "RECRUITER" ? companyName || name : null;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      role,
      companyName: resolvedCompanyName,
    },
  });

  // Recherche + enregistrement automatique du logo de l'entreprise pour les
  // recruteurs. Best-effort : borné par des timeouts, ne bloque jamais et ne
  // fait jamais échouer l'inscription si le logo est introuvable.
  if (resolvedCompanyName) {
    try {
      const logoUrl = await findAndStoreCompanyLogo(resolvedCompanyName);
      if (logoUrl) {
        await prisma.user.update({
          where: { id: user.id },
          data: { logoUrl },
        });
        user.logoUrl = logoUrl;
      }
    } catch {
      // On ignore : le recruteur pourra téléverser son logo manuellement.
    }
  }

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
