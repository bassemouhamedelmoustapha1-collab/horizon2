import { NextResponse } from "next/server";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { alertSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { alertCreatedEmail } from "@/lib/job-alerts";

// POST /api/alerts — crée une alerte e-mail { email, q?, category?, location? }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const q = parsed.data.q || null;
  const location = parsed.data.location || null;

  // Slug de catégorie → id (silencieusement ignoré si inconnu)
  let categoryId: string | null = null;
  if (parsed.data.category) {
    const cat = await prisma.category.findUnique({
      where: { slug: parsed.data.category },
    });
    categoryId = cat?.id ?? null;
  }

  // Déduplication : même e-mail + mêmes critères = alerte déjà en place.
  const existing = await prisma.jobAlert.findFirst({
    where: { email, q, location, categoryId },
  });
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const alert = await prisma.jobAlert.create({
    data: { email, q, location, categoryId },
    include: { category: { select: { name: true } } },
  });

  // E-mail de confirmation, envoyé après la réponse (ne bloque pas l'UI).
  after(async () => {
    const { subject, html } = alertCreatedEmail(alert);
    await sendEmail({ to: email, subject, html });
  });

  return NextResponse.json({ ok: true });
}
