"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { formatDate, accentFor } from "@/lib/format";
import { InboxIcon, ArrowRightIcon, FileIcon } from "@/components/Icon";
import StatusBadge from "./StatusBadge";
import type { Application, ApplicationStatus, Job } from "@/lib/types";

export default function ApplicationsReview({
  job,
  initialApplications,
}: {
  job: Job;
  initialApplications: Application[];
}) {
  const { t, lang } = useI18n();
  const [applications, setApplications] = useState(initialApplications);
  const [busy, setBusy] = useState<string | null>(null);

  async function updateStatus(id: string, status: ApplicationStatus) {
    setBusy(id);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    }
  }

  return (
    <div className="container-x py-10">
      <Link
        href="/recruiter"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6"
      >
        <ArrowRightIcon size={15} className="rotate-180" />
        {t.recruiter.myJobs}
      </Link>

      <div className="mb-8">
        <p className="text-slate-500">
          {t.recruiter.applicantsFor} · {job.location}
        </p>
        <h1 className="text-3xl font-bold text-navy-900">{job.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {applications.length} {t.recruiter.applicationsReceived}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 grid place-items-center text-slate-400">
            <InboxIcon size={26} />
          </div>
          <p className="mt-4 text-slate-500">{t.recruiter.noApplicants}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 card-shadow"
            >
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className={`shrink-0 grid place-items-center w-12 h-12 rounded-xl text-white font-bold ${accentFor(
                    app.candidate!.name
                  )}`}
                >
                  {app.candidate!.name.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-navy-900">
                      {app.candidate!.name}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>
                  {app.candidate!.title && (
                    <p className="text-sm text-brand-700">
                      {app.candidate!.title}
                    </p>
                  )}
                  <p className="text-sm text-slate-500">
                    {app.candidate!.email}
                    {app.candidate!.location && ` · ${app.candidate!.location}`}
                  </p>
                  {app.candidate!.phone && (
                    <p className="text-sm text-slate-500">
                      {app.candidate!.phone}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {t.recruiter.appliedOn} {formatDate(app.createdAt, lang)}
                  </p>
                </div>

                {app.candidate!.cvUrl ? (
                  <a
                    href={app.candidate!.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-brand-700 bg-brand-50 rounded-full hover:bg-brand-100 transition-colors"
                  >
                    <FileIcon size={16} />
                    {t.recruiter.viewCv}
                  </a>
                ) : (
                  <span className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 text-sm text-slate-400 bg-slate-50 rounded-full">
                    <FileIcon size={16} />
                    {t.recruiter.noCv}
                  </span>
                )}
              </div>

              {app.candidate!.bio && (
                <p className="mt-3 text-sm text-slate-600">
                  {app.candidate!.bio}
                </p>
              )}
              {app.coverLetter && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    {t.jobs.coverLetter}
                  </p>
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {app.coverLetter}
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton
                  label={t.recruiter.markReviewed}
                  onClick={() => updateStatus(app.id, "REVIEWED")}
                  disabled={busy === app.id || app.status === "REVIEWED"}
                  variant="neutral"
                />
                <ActionButton
                  label={t.recruiter.accept}
                  onClick={() => updateStatus(app.id, "ACCEPTED")}
                  disabled={busy === app.id || app.status === "ACCEPTED"}
                  variant="accept"
                />
                <ActionButton
                  label={t.recruiter.reject}
                  onClick={() => updateStatus(app.id, "REJECTED")}
                  disabled={busy === app.id || app.status === "REJECTED"}
                  variant="reject"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  variant,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: "neutral" | "accept" | "reject";
}) {
  const styles = {
    neutral: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    accept: "bg-emerald-600 text-white hover:bg-emerald-700",
    reject: "bg-red-50 text-red-600 hover:bg-red-100",
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles}`}
    >
      {label}
    </button>
  );
}
