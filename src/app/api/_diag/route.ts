import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Diagnostic temporaire (à supprimer après). Ne révèle aucun secret :
// uniquement l'hôte de la base et le message d'erreur Prisma éventuel.
export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const info: Record<string, unknown> = {
    hasDatabaseUrl: !!dbUrl,
    dbHost: dbUrl.split("@")[1]?.split("/")[0] ?? null,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    appUrl: process.env.APP_URL ?? null,
  };
  try {
    info.jobCount = await prisma.job.count();
    info.ok = true;
  } catch (e) {
    info.ok = false;
    info.errorName = e instanceof Error ? e.name : "unknown";
    info.error = (e instanceof Error ? e.message : String(e)).slice(0, 600);
  }
  return NextResponse.json(info);
}
