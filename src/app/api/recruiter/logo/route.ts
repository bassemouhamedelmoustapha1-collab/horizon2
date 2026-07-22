import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/storage";

const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

// POST /api/recruiter/logo — upload du logo d'entreprise (recruteur uniquement)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Format non supporté (PNG, JPG, WEBP ou SVG uniquement)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Le fichier dépasse 2 Mo." },
      { status: 400 }
    );
  }

  // Supprime l'ancien logo du recruteur, s'il existait
  const existing = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { logoUrl: true },
  });
  await deleteUpload(existing?.logoUrl);

  const buffer = Buffer.from(await file.arrayBuffer());
  const logoUrl = await saveUpload({
    key: `uploads/logos/${session.userId}-${Date.now()}.${ext}`,
    buffer,
    contentType: file.type,
  });

  await prisma.user.update({
    where: { id: session.userId },
    data: { logoUrl },
  });

  return NextResponse.json({ logoUrl });
}

// DELETE /api/recruiter/logo — retire le logo actuel
export async function DELETE() {
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { logoUrl: true },
  });
  await deleteUpload(existing?.logoUrl);

  await prisma.user.update({
    where: { id: session.userId },
    data: { logoUrl: null },
  });

  return NextResponse.json({ ok: true });
}
