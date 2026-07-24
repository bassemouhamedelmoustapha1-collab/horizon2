import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import RecruiterDashboard, {
  type RecruiterActivity,
  type RecruiterStats,
} from "@/components/RecruiterDashboard";
import type { Job } from "@/lib/types";

export default async function RecruiterPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RECRUITER") redirect("/candidate");

  const where = { job: { recruiterId: session.userId } };

  const [user, jobsRaw, recentRaw, grouped] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.job.findMany({
      where: { recruiterId: session.userId },
      include: { category: true, _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where,
      include: {
        candidate: { select: { name: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.application.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
  ]);

  const jobs = JSON.parse(JSON.stringify(jobsRaw)) as Job[];

  const activity: RecruiterActivity[] = recentRaw.map((a) => ({
    id: a.id,
    candidateName: a.candidate.name,
    jobId: a.job.id,
    jobTitle: a.job.title,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
  }));

  const countBy = (s: string) =>
    grouped.find((g) => g.status === s)?._count._all ?? 0;
  const stats: RecruiterStats = {
    total: grouped.reduce((sum, g) => sum + g._count._all, 0),
    pending: countBy("PENDING"),
    reviewed: countBy("REVIEWED"),
    accepted: countBy("ACCEPTED"),
    rejected: countBy("REJECTED"),
  };

  return (
    <RecruiterDashboard
      jobs={jobs}
      name={session.name}
      companyName={user?.companyName ?? null}
      logoUrl={user?.logoUrl ?? null}
      activity={activity}
      stats={stats}
    />
  );
}
