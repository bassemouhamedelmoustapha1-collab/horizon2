import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/jobs/:id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      category: true,
      recruiter: {
        select: {
          name: true,
          companyName: true,
          location: true,
          logoUrl: true,
        },
      },
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
  }

  return NextResponse.json({ job });
}
