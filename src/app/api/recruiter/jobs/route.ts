import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/recruiter/jobs — offres publiées par le recruteur connecté
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const jobs = await prisma.job.findMany({
    where: { recruiterId: session.userId },
    include: {
      category: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}
