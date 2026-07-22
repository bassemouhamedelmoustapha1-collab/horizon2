import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/storage";

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

// POST /api/candidate/cv — upload du CV (candidat uniquement)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "CANDIDATE") {
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
      { error: "Format non supporté (PDF, DOC ou DOCX uniquement)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Le fichier dépasse 5 Mo." },
      { status: 400 }
    );
  }

  // Supprime l'ancien CV du candidat, s'il existait
  const existing = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cvUrl: true },
  });
  await deleteUpload(existing?.cvUrl);

  const buffer = Buffer.from(await file.arrayBuffer());
  const cvUrl = await saveUpload({
    key: `uploads/cv/${session.userId}-${Date.now()}.${ext}`,
    buffer,
    contentType: file.type,
  });

  await prisma.user.update({
    where: { id: session.userId },
    data: { cvUrl, cvFileName: file.name },
  });

  return NextResponse.json({ cvUrl, cvFileName: file.name });
}

// DELETE /api/candidate/cv — retire le CV actuel
export async function DELETE() {
  const session = await getSession();
  if (!session || session.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cvUrl: true },
  });
  await deleteUpload(existing?.cvUrl);

  await prisma.user.update({
    where: { id: session.userId },
    data: { cvUrl: null, cvFileName: null },
  });

  return NextResponse.json({ ok: true });
}
