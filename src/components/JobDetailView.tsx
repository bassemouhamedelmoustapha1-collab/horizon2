"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { formatSalary, formatDate } from "@/lib/format";
import {
  MapPinIcon,
  ClockIcon,
  WalletIcon,
  UsersIcon,
  BriefcaseIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/Icon";
import CompanyLogo from "@/components/CompanyLogo";
import type { Job } from "@/lib/types";
import type { ReactNode } from "react";

function lines(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function JobDetailView({
  job,
  alreadyApplied,
}: {
  job: Job;
  alreadyApplied: boolean;
}) {
  const { t, lang } = useI18n();
  const user = useAuth();
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);
  const applicants = job._count?.applications ?? 0;

  const missions = lines(job.responsibilities);
  const requirements = lines(job.requirements);
  const skills = lines(job.skills);
  const benefits = lines(job.benefits);

  return (
    <div className="bg-slate-50/60 min-h-[calc(100vh-4rem)]">
      <div className="container-x py-10">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6"
        >
          <ArrowRightIcon size={15} className="rotate-180" />
          {t.jobs.title}
        </Link>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* ---------- Colonne principale ---------- */}
          <div className="space-y-5">
            {/* En-tête */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 card-shadow">
              <div className="flex items-start gap-4">
                <CompanyLogo
                  name={job.companyName}
                  logoUrl={job.recruiter?.logoUrl}
                  className="w-16 h-16 rounded-2xl"
                  textClassName="text-2xl"
                />
                <div className="min-w-0">
                  <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {job.category.name}
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-navy-900">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-slate-500">{job.companyName}</p>
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <InfoTile
                  icon={<MapPinIcon size={16} />}
                  label={t.jobs.filterLocation}
                  value={job.location}
                />
                <InfoTile
                  icon={<ClockIcon size={16} />}
                  label={t.jobs.contractType}
                  value={t.jobType[job.type]}
                />
                {salary && (
                  <InfoTile
                    icon={<WalletIcon size={16} />}
                    label={t.jobs.salary}
                    value={salary}
                  />
                )}
                {job.experience && (
                  <InfoTile
                    icon={<BriefcaseIcon size={16} />}
                    label={t.jobs.experienceRequired}
                    value={job.experience}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <Section title={t.jobs.description}>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </Section>

            {/* Missions */}
            {missions.length > 0 && (
              <Section title={t.jobs.missions}>
                <BulletList items={missions} />
              </Section>
            )}

            {/* Profil recherché */}
            {requirements.length > 0 && (
              <Section title={t.jobs.profileWanted}>
                <BulletList items={requirements} />
              </Section>
            )}

            {/* Formation + Compétences */}
            {(job.education || skills.length > 0) && (
              <Section title={t.jobs.skills}>
                {job.education && (
                  <p className="text-sm text-slate-600 mb-4">
                    <span className="font-medium text-navy-900">
                      {t.jobs.education} :
                    </span>{" "}
                    {job.education}
                  </p>
                )}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="text-sm font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Avantages */}
            {benefits.length > 0 && (
              <Section title={t.jobs.benefits}>
                <BulletList items={benefits} />
              </Section>
            )}

            {/* Entreprise */}
            {job.recruiter && (
              <Section title={t.jobs.aboutCompany}>
                <div className="flex items-center gap-3">
                  <CompanyLogo
                    name={job.companyName}
                    logoUrl={job.recruiter.logoUrl}
                    className="w-11 h-11 rounded-xl"
                  />
                  <p className="text-slate-600">
                    <span className="font-semibold text-navy-900">
                      {job.recruiter.companyName || job.companyName}
                    </span>
                    {job.recruiter.location && (
                      <span className="block text-sm text-slate-500">
                        {job.recruiter.location}
                      </span>
                    )}
                  </p>
                </div>
              </Section>
            )}
          </div>

          {/* ---------- Panneau latéral (sticky) ---------- */}
          <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
            {salary && (
              <>
                <p className="text-sm text-slate-500">{t.jobs.salary}</p>
                <p className="text-xl font-bold text-navy-900">{salary}</p>
                <div className="my-4 h-px bg-slate-100" />
              </>
            )}

            <dl className="space-y-3 text-sm">
              <Row label={t.jobs.contractType} value={t.jobType[job.type]} />
              {job.experience && (
                <Row label={t.jobs.experienceRequired} value={job.experience} />
              )}
              {job.positions ? (
                <Row
                  label={t.jobs.positionsLabel}
                  value={String(job.positions)}
                />
              ) : null}
              <Row
                label={t.jobs.postedOn}
                value={formatDate(job.createdAt, lang)}
              />
            </dl>

            <div className="mt-5">
              <ApplyCta
                jobId={job.id}
                alreadyApplied={alreadyApplied}
                isCandidate={user?.role === "CANDIDATE"}
                isRecruiter={user?.role === "RECRUITER"}
                loggedIn={!!user}
              />
            </div>

            {applicants > 0 && (
              <p className="mt-4 text-xs text-slate-400 text-center inline-flex items-center gap-1.5 w-full justify-center">
                <UsersIcon size={14} />
                {applicants}{" "}
                {applicants > 1 ? t.jobs.applicantsPlural : t.jobs.applicant}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplyCta({
  jobId,
  alreadyApplied,
  isCandidate,
  isRecruiter,
  loggedIn,
}: {
  jobId: string;
  alreadyApplied: boolean;
  isCandidate: boolean;
  isRecruiter: boolean;
  loggedIn: boolean;
}) {
  const { t } = useI18n();

  if (alreadyApplied) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-xl">
        <CheckIcon size={18} />
        {t.jobs.applied}
      </div>
    );
  }
  if (isRecruiter) {
    return (
      <p className="text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3 text-center">
        {t.jobs.recruiterCantApply}
      </p>
    );
  }
  if (loggedIn && isCandidate) {
    return (
      <Link
        href={`/jobs/${jobId}/apply`}
        className="group flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
      >
        {t.jobs.applyCta}
        <ArrowRightIcon size={18} />
      </Link>
    );
  }
  return (
    <Link
      href="/login"
      className="block w-full text-center py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
    >
      {t.jobs.loginToApply}
    </Link>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 card-shadow">
      <h2 className="text-lg font-bold text-navy-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5 text-slate-600">
          <span className="mt-0.5 text-brand-600 shrink-0">
            <CheckIcon size={17} />
          </span>
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-500 inline-flex items-center gap-1.5">
        <span className="text-slate-400">{icon}</span>
        {label}
      </p>
      <p className="mt-1 font-semibold text-navy-900 text-sm">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-navy-900 text-right">{value}</dd>
    </div>
  );
}
