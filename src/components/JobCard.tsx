"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { formatSalary, formatDate } from "@/lib/format";
import { MapPinIcon } from "@/components/Icon";
import CompanyLogo from "@/components/CompanyLogo";
import type { Job } from "@/lib/types";

export default function JobCard({ job }: { job: Job }) {
  const { t, lang } = useI18n();
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 p-5 hover:border-brand-200 hover:shadow-[0_6px_24px_rgba(16,34,77,0.08)] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mb-3">
            {job.category.name}
          </span>
          <h3 className="font-semibold text-navy-900 text-lg leading-snug group-hover:text-brand-600 transition-colors truncate">
            {job.title}
          </h3>
        </div>
        <CompanyLogo
          name={job.companyName}
          logoUrl={job.recruiter?.logoUrl}
          className="w-11 h-11 rounded-xl"
          textClassName="text-lg"
        />
      </div>

      <p className="mt-1 text-sm text-slate-500">{job.companyName}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <MapPinIcon size={15} className="text-slate-400" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
          {t.jobType[job.type]}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-navy-900">
          {salary ?? "—"}
        </span>
        <span className="text-xs text-slate-400">
          {formatDate(job.createdAt, lang)}
        </span>
      </div>
    </Link>
  );
}
