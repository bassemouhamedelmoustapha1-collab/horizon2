import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"] as const;

// PATCH /api/applications/:id — le recruteur met à jour le statut
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 });
  }
  if (application.job.recruiterId !== session.userId) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ application: updated });
}
