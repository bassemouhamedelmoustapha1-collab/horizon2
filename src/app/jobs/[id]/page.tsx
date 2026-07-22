import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import JobDetailView from "@/components/JobDetailView";
import type { Job } from "@/lib/types";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const jobRaw = await prisma.job.findUnique({
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

  if (!jobRaw) notFound();

  const session = await getSession();
  let alreadyApplied = false;
  if (session?.role === "CANDIDATE") {
    const existing = await prisma.application.findUnique({
      where: {
        jobId_candidateId: { jobId: id, candidateId: session.userId },
      },
    });
    alreadyApplied = !!existing;
  }

  const job = JSON.parse(JSON.stringify(jobRaw)) as Job;

  return <JobDetailView job={job} alreadyApplied={alreadyApplied} />;
}
