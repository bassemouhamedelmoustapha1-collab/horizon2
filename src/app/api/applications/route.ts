import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/applications — candidatures du candidat connecté
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const applications = await prisma.application.findMany({
    where: { candidateId: session.userId },
    include: {
      job: {
        include: {
          category: true,
          recruiter: { select: { logoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}
