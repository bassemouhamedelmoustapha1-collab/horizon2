"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/format";
import { BriefcaseIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import CompanyLogo from "@/components/CompanyLogo";
import type { Job } from "@/lib/types";

export default function RecruiterDashboard({
  jobs,
  name,
  companyName,
  logoUrl,
}: {
  jobs: Job[];
  name: string;
  companyName: string | null;
  logoUrl: string | null;
}) {
  const { t, lang } = useI18n();
  const totalApplications = jobs.reduce(
    (sum, j) => sum + (j._count?.applications ?? 0),
    0
  );
  const displayName = companyName || name;

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <CompanyLogo
            name={displayName}
            logoUrl={logoUrl}
            className="w-11 h-11 rounded-xl"
          />
          <div>
            <Link
              href="/recruiter/settings"
              className="text-sm text-slate-500 hover:text-brand-600 hover:underline"
            >
              {displayName}
            </Link>
            <h1 className="text-3xl font-bold text-navy-900">
              {t.recruiter.myJobs}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recruiter/settings"
            className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50"
          >
            {t.recruiter.companySettings}
          </Link>
          <InteractiveHoverButton
            href="/recruiter/jobs/new"
            text={t.recruiter.postNewJob}
            className="px-5 py-2.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <StatCard label={t.recruiter.myJobs} value={jobs.length} />
        <StatCard
          label={t.recruiter.applicationsReceived}
          value={totalApplications}
        />
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 grid place-items-center text-slate-400">
            <BriefcaseIcon size={26} />
          </div>
          <p className="mt-4 text-slate-500">{t.recruiter.noJobs}</p>
          <Link
            href="/recruiter/jobs/new"
            className="mt-5 inline-flex px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700"
          >
            {t.recruiter.postNewJob}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 card-shadow"
            >
              <div className="flex-1 min-w-[200px]">
                <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mb-1">
                  {job.category.name}
                </span>
                <h3 className="font-semibold text-navy-900">{job.title}</h3>
                <p className="text-sm text-slate-500">
                  {job.location} · {t.jobType[job.type]} ·{" "}
                  {formatDate(job.createdAt, lang)}
                </p>
              </div>

              <div className="text-center px-4">
                <p className="text-2xl font-bold text-brand-600">
                  {job._count?.applications ?? 0}
                </p>
                <p className="text-xs text-slate-500">
                  {t.recruiter.applicationsReceived}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50"
                >
                  {t.jobs.details}
                </Link>
                <Link
                  href={`/recruiter/jobs/${job.id}/applications`}
                  className="px-4 py-2 text-sm font-semibold text-white bg-navy-800 rounded-full hover:bg-navy-900"
                >
                  {t.recruiter.viewApplications}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 card-shadow">
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
