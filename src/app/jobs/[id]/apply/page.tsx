import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ApplyForm from "@/components/ApplyForm";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect(`/login`);
  if (session.role !== "CANDIDATE") redirect(`/jobs/${id}`);

  const job = await prisma.job.findUnique({
    where: { id },
    include: { recruiter: { select: { logoUrl: true } } },
  });
  if (!job) notFound();

  // Déjà postulé ? On renvoie vers la fiche (qui affiche « Candidature envoyée »).
  const existing = await prisma.application.findUnique({
    where: { jobId_candidateId: { jobId: id, candidateId: session.userId } },
  });
  if (existing) redirect(`/jobs/${id}`);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      phone: true,
      cvUrl: true,
      cvFileName: true,
    },
  });
  if (!user) redirect("/login");

  return (
    <ApplyForm
      jobId={job.id}
      jobTitle={job.title}
      companyName={job.companyName}
      companyLogoUrl={job.recruiter?.logoUrl ?? null}
      candidateName={user.name}
      candidateEmail={user.email}
      initialPhone={user.phone}
      initialCvUrl={user.cvUrl}
      initialCvFileName={user.cvFileName}
    />
  );
}
