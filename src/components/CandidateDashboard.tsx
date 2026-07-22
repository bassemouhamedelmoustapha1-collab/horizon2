"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/format";
import { InboxIcon, FileIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import CompanyLogo from "@/components/CompanyLogo";
import StatusBadge from "./StatusBadge";
import type { Application } from "@/lib/types";

export default function CandidateDashboard({
  applications,
  name,
  hasCv,
}: {
  applications: Application[];
  name: string;
  hasCv: boolean;
}) {
  const { t, lang } = useI18n();

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <Link
            href="/candidate/settings"
            className="text-sm text-slate-500 hover:text-brand-600 hover:underline"
          >
            {name}
          </Link>
          <h1 className="text-3xl font-bold text-navy-900">
            {t.candidate.myApplications}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/candidate/settings"
            className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50"
          >
            {t.candidate.profileSettings}
          </Link>
          <InteractiveHoverButton
            href="/jobs"
            text={t.candidate.browseJobs}
            className="px-5 py-2.5"
          />
        </div>
      </div>

      {!hasCv && (
        <Link
          href="/candidate/settings"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-3.5 hover:bg-brand-100/70 transition-colors"
        >
          <span className="w-9 h-9 rounded-xl bg-white text-brand-600 grid place-items-center shrink-0">
            <FileIcon size={18} />
          </span>
          <span className="text-sm text-brand-800">
            <span className="font-medium">{t.candidate.uploadCv}</span> —{" "}
            {t.candidate.cvHint}
          </span>
        </Link>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label={t.candidate.myApplications} value={applications.length} />
        <StatCard
          label={t.status.PENDING}
          value={applications.filter((a) => a.status === "PENDING").length}
        />
        <StatCard
          label={t.status.ACCEPTED}
          value={applications.filter((a) => a.status === "ACCEPTED").length}
        />
        <StatCard
          label={t.status.REVIEWED}
          value={applications.filter((a) => a.status === "REVIEWED").length}
        />
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 grid place-items-center text-slate-400">
            <InboxIcon size={26} />
          </div>
          <p className="mt-4 text-slate-500">{t.candidate.noApplications}</p>
          <Link
            href="/jobs"
            className="mt-5 inline-flex px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700"
          >
            {t.candidate.browseJobs}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/jobs/${app.job!.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 card-shadow hover:border-brand-300 transition-colors"
            >
              <CompanyLogo
                name={app.job!.companyName}
                logoUrl={app.job!.recruiter?.logoUrl}
                className="w-12 h-12 rounded-xl"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-navy-900 truncate">
                  {app.job!.title}
                </h3>
                <p className="text-sm text-slate-500 truncate">
                  {app.job!.companyName} · {app.job!.location}
                </p>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status={app.status} />
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(app.createdAt, lang)}
                </p>
              </div>
            </Link>
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
