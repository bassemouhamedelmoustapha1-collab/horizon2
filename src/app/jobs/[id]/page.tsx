import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import JobDetailView from "@/components/JobDetailView";
import type { Job } from "@/lib/types";

// Une seule requête par rendu, partagée entre generateMetadata et la page.
const getJob = cache(async (id: string) =>
  prisma.job.findUnique({
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
  })
);

/** Titre et description uniques par offre — indispensables pour le SEO. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return {};
  return {
    title: `${job.title} — ${job.companyName}, ${job.location} | Horizon`,
    description: job.description.slice(0, 160),
  };
}

// Correspondance types internes → valeurs schema.org employmentType.
const SCHEMA_TYPE: Record<string, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERNSHIP: "INTERN",
  REMOTE: "FULL_TIME",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const jobRaw = await getJob(id);
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

  // Balisage JobPosting (schema.org) : requis pour apparaître dans
  // Google Jobs, principale source de trafic d'un site d'emploi.
  const [locality, country] = job.location.split(",").map((s) => s.trim());
  const posted = new Date(job.createdAt);
  const validThrough = new Date(posted);
  validThrough.setDate(validThrough.getDate() + 60);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: posted.toISOString(),
    validThrough: validThrough.toISOString(),
    employmentType: SCHEMA_TYPE[job.type] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        ...(country ? { addressCountry: country } : {}),
      },
    },
    directApply: true,
  };
  if (job.type === "REMOTE") {
    jsonLd.jobLocationType = "TELECOMMUTE";
  }
  if (job.salaryMin || job.salaryMax) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency,
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin ? { minValue: job.salaryMin } : {}),
        ...(job.salaryMax ? { maxValue: job.salaryMax } : {}),
        unitText: "MONTH",
      },
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetailView job={job} alreadyApplied={alreadyApplied} />
    </>
  );
}
