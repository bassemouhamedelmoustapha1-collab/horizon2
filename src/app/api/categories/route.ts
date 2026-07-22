import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories — avec le nombre d'offres ouvertes
export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}
