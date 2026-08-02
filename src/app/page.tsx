import { prisma } from "@/lib/prisma";
import { getCategoriesCached } from "@/lib/categories";
import { HeroOdyssey } from "@/components/ui/hero-odyssey";
import Ticker from "@/components/home/Ticker";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import CtaSplit from "@/components/home/CtaSplit";
import type { Job, Category } from "@/lib/types";

export default async function HomePage() {
  const [categoriesRaw, jobsRaw] = await Promise.all([
    getCategoriesCached(),
    prisma.job.findMany({
      include: {
        category: true,
        recruiter: { select: { logoUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const categories = JSON.parse(JSON.stringify(categoriesRaw)) as Category[];
  const jobs = JSON.parse(JSON.stringify(jobsRaw)) as Job[];

  return (
    <>
      <HeroOdyssey />
      <Ticker />
      <CategoryGrid categories={categories} />
      <FeaturedJobs jobs={jobs} />
      <CtaSplit />
    </>
  );
}
