import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import RecruiterDashboard from "@/components/RecruiterDashboard";
import type { Job } from "@/lib/types";

export default async function RecruiterPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RECRUITER") redirect("/candidate");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  const jobsRaw = await prisma.job.findMany({
    where: { recruiterId: session.userId },
    include: {
      category: true,
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const jobs = JSON.parse(JSON.stringify(jobsRaw)) as Job[];

  return (
    <RecruiterDashboard
      jobs={jobs}
      name={session.name}
      companyName={user?.companyName ?? null}
      logoUrl={user?.logoUrl ?? null}
    />
  );
}
