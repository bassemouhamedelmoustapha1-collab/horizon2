import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ApplicationsReview from "@/components/ApplicationsReview";
import type { Application, Job } from "@/lib/types";

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RECRUITER") redirect("/candidate");

  const jobRaw = await prisma.job.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!jobRaw) notFound();
  if (jobRaw.recruiterId !== session.userId) redirect("/recruiter");

  const applicationsRaw = await prisma.application.findMany({
    where: { jobId: id },
    include: {
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          title: true,
          location: true,
          bio: true,
          phone: true,
          cvUrl: true,
          cvFileName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const job = JSON.parse(JSON.stringify(jobRaw)) as Job;
  const applications = JSON.parse(
    JSON.stringify(applicationsRaw)
  ) as Application[];

  return <ApplicationsReview job={job} initialApplications={applications} />;
}
