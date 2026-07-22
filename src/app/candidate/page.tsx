import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import CandidateDashboard from "@/components/CandidateDashboard";
import type { Application } from "@/lib/types";

export default async function CandidatePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "CANDIDATE") redirect("/recruiter");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cvUrl: true },
  });

  const applicationsRaw = await prisma.application.findMany({
    where: { candidateId: session.userId },
    include: {
      job: {
        include: {
          category: true,
          recruiter: { select: { logoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const applications = JSON.parse(
    JSON.stringify(applicationsRaw)
  ) as Application[];

  return (
    <CandidateDashboard
      applications={applications}
      name={session.name}
      hasCv={!!user?.cvUrl}
    />
  );
}
