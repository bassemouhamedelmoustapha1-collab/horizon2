import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { applicationSchema } from "@/lib/validation";

// POST /api/jobs/:id/apply  (candidat uniquement)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }
  if (session.role !== "CANDIDATE") {
    return NextResponse.json(
      { error: "Les recruteurs ne peuvent pas postuler." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = applicationSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
  }

  const existing = await prisma.application.findUnique({
    where: { jobId_candidateId: { jobId, candidateId: session.userId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Vous avez déjà postulé à cette offre." },
      { status: 409 }
    );
  }

  // Met à jour le téléphone du candidat s'il l'a renseigné au moment de postuler.
  if (parsed.data.phone) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { phone: parsed.data.phone },
    });
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      candidateId: session.userId,
      coverLetter: parsed.data.coverLetter,
    },
  });

  return NextResponse.json({ application });
}
