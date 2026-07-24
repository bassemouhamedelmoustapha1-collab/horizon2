"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/format";
import { BriefcaseIcon, UserIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import CompanyLogo from "@/components/CompanyLogo";
import ActivityFeed, { type ActivityItem } from "@/components/ActivityFeed";
import type { Job, ApplicationStatus } from "@/lib/types";

export type RecruiterActivity = {
  id: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  status: ApplicationStatus;
  createdAt: string;
};

export type RecruiterStats = {
  total: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
};

export default function RecruiterDashboard({
  jobs,
  name,
  companyName,
  logoUrl,
  activity,
  stats,
}: {
  jobs: Job[];
  name: string;
  companyName: string | null;
  logoUrl: string | null;
  activity: RecruiterActivity[];
  stats: RecruiterStats;
}) {
  const { t, lang } = useI18n();
  const displayName = companyName || name;

  const feed: ActivityItem[] = activity.map((a) => ({
    id: a.id,
    icon: <UserIcon size={16} />,
    title: `${a.candidateName} ${t.activity.applied}`,
    subtitle: a.jobTitle,
    time: a.createdAt,
    href: `/recruiter/jobs/${a.jobId}/applications`,
    tone: "blue",
    unread: a.status === "PENDING",
  }));

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

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label={t.recruiter.myJobs} value={jobs.length} />
        <StatCard
          label={t.recruiter.applicationsReceived}
          value={stats.total}
        />
        <StatCard
          label={t.activity.toReview}
          value={stats.pending}
          tone="amber"
        />
        <StatCard label={t.status.ACCEPTED} value={stats.accepted} tone="green" />
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
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Offres */}
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-wrap items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 card-shadow"
              >
                <div className="flex-1 min-w-[180px]">
                  <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mb-1">
                    {job.category.name}
                  </span>
                  <h3 className="font-semibold text-navy-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">
                    {job.location} · {t.jobType[job.type]} ·{" "}
                    {formatDate(job.createdAt, lang)}
                  </p>
                </div>

                <div className="text-center px-2">
                  <p className="text-2xl font-bold text-brand-600">
                    {job._count?.applications ?? 0}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.recruiter.applicationsReceived}
                  </p>
                </div>

                <Link
                  href={`/recruiter/jobs/${job.id}/applications`}
                  className="px-4 py-2 text-sm font-semibold text-white bg-navy-800 rounded-full hover:bg-navy-900"
                >
                  {t.recruiter.viewApplications}
                </Link>
              </div>
            ))}
          </div>

          {/* Messagerie / activité */}
          <div className="lg:sticky lg:top-24">
            <ActivityFeed
              title={t.activity.recruiterTitle}
              items={feed}
              emptyLabel={t.activity.empty}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "amber" | "green";
}) {
  const valueColor =
    tone === "amber"
      ? "text-amber-600"
      : tone === "green"
        ? "text-emerald-600"
        : "text-navy-900";
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 card-shadow">
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
