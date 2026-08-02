import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCategoriesCached } from "@/lib/categories";
import JobsExplorer from "@/components/JobsExplorer";
import type { Prisma } from "@prisma/client";
import type { Job, Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Offres d'emploi en Afrique | Horizon",
  description:
    "Parcourez les offres d'emploi publiées sur Horizon : CDI, CDD, stages et télétravail dans dix pays d'Afrique.",
};

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"];

/**
 * Liste des offres, RENDUE CÔTÉ SERVEUR : le HTML envoyé contient les
 * annonces (titres, entreprises, villes), donc Google les indexe.
 * Les filtres (JobsExplorer) modifient l'URL, et le serveur re-rend.
 */
export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

  const q = one(sp.q);
  const category = one(sp.category);
  const type = one(sp.type);
  const location = one(sp.location);

  const where: Prisma.JobWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { companyName: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };
  if (type && JOB_TYPES.includes(type))
    where.type = type as Prisma.JobWhereInput["type"];
  if (location) where.location = { contains: location, mode: "insensitive" };

  const [jobsRaw, categoriesRaw] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        category: true,
        recruiter: { select: { logoUrl: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getCategoriesCached(),
  ]);

  const jobs = JSON.parse(JSON.stringify(jobsRaw)) as Job[];
  const categories = JSON.parse(JSON.stringify(categoriesRaw)) as Category[];

  return (
    <JobsExplorer
      jobs={jobs}
      categories={categories}
      initialFilters={{ q, category, type, location }}
    />
  );
}
