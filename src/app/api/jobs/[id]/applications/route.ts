import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/jobs/:id/applications — candidatures reçues (recruteur propriétaire)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
  }
  if (job.recruiterId !== session.userId) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const applications = await prisma.application.findMany({
    where: { jobId: id },
    include: {
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          title: true,
          location: true,
          bio: true,
          phone: true,
          cvUrl: true,
          cvFileName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ job, applications });
}
