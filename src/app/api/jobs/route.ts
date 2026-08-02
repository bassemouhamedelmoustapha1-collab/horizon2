import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { jobSchema } from "@/lib/validation";
import type { Prisma } from "@prisma/client";

// GET /api/jobs?q=&category=&type=&location=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();
  const type = searchParams.get("type")?.trim();
  const location = searchParams.get("location")?.trim();

  const where: Prisma.JobWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };
  if (type) where.type = type as Prisma.JobWhereInput["type"];
  if (location) where.location = { contains: location, mode: "insensitive" };

  const jobs = await prisma.job.findMany({
    where,
    include: {
      category: true,
      recruiter: { select: { logoUrl: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

// POST /api/jobs  (recruteur uniquement)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "RECRUITER") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const recruiter = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!recruiter) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const job = await prisma.job.create({
    data: {
      ...parsed.data,
      companyName: recruiter.companyName || recruiter.name,
      recruiterId: recruiter.id,
    },
  });

  return NextResponse.json({ job });
}
