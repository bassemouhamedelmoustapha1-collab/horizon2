"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Field } from "@/components/ui/Field";
import {
  FileIcon,
  DownloadIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/components/Icon";
import CompanyLogo from "@/components/CompanyLogo";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const CV_ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ApplyForm({
  jobId,
  jobTitle,
  companyName,
  companyLogoUrl,
  candidateName,
  candidateEmail,
  initialPhone,
  initialCvUrl,
  initialCvFileName,
}: {
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl: string | null;
  candidateName: string;
  candidateEmail: string;
  initialPhone: string | null;
  initialCvUrl: string | null;
  initialCvFileName: string | null;
}) {
  const { t } = useI18n();
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState(initialPhone ?? "");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState(initialCvUrl);
  const [cvFileName, setCvFileName] = useState(initialCvFileName);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function onCvSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvError("");
    if (!CV_ACCEPTED.includes(file.type)) {
      setCvError(t.candidate.cvErrorFormat);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError(t.candidate.cvErrorSize);
      return;
    }
    setCvUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/candidate/cv", { method: "POST", body: fd });
    const data = await res.json();
    setCvUploading(false);
    if (!res.ok) {
      setCvError(data.error || t.candidate.cvErrorGeneric);
      return;
    }
    setCvUrl(data.cvUrl);
    setCvFileName(data.cvFileName);
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverLetter, phone }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/candidate";
    }, 1400);
  }

  if (success) {
    return (
      <div className="container-x py-20 max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
          <CheckIcon size={30} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-navy-900">
          {t.jobs.applicationSuccess}
        </h1>
        <p className="mt-2 text-slate-500">{t.candidate.myApplications}…</p>
      </div>
    );
  }

  return (
    <div className="container-x py-10 max-w-2xl">
      <Link
        href={`/jobs/${jobId}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6"
      >
        <ArrowRightIcon size={15} className="rotate-180" />
        {t.jobs.details}
      </Link>

      {/* Rappel de l'offre */}
      <div className="flex items-center gap-3 mb-8">
        <CompanyLogo
          name={companyName}
          logoUrl={companyLogoUrl}
          className="w-12 h-12 rounded-xl"
        />
        <div>
          <h1 className="text-2xl font-bold text-navy-900 leading-tight">
            {jobTitle}
          </h1>
          <p className="text-sm text-slate-500">{companyName}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* CV */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
          <h2 className="font-bold text-navy-900">{t.jobs.yourCv}</h2>
          <input
            ref={cvInputRef}
            type="file"
            accept={CV_ACCEPTED.join(",")}
            className="hidden"
            onChange={onCvSelected}
          />
          {cvUrl ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                <FileIcon size={22} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-900 truncate">
                  {cvFileName || t.candidate.myCv}
                </p>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
                >
                  <DownloadIcon size={13} />
                  {t.candidate.downloadCv}
                </a>
              </div>
              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                disabled={cvUploading}
                className="text-sm font-medium text-slate-600 border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50 disabled:opacity-60"
              >
                {cvUploading ? t.common.loading : t.candidate.changeCv}
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => cvInputRef.current?.click()}
                disabled={cvUploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 disabled:opacity-60"
              >
                <FileIcon size={16} />
                {cvUploading ? t.common.loading : t.candidate.uploadCv}
              </button>
              <p className="text-xs text-slate-400">{t.jobs.noCvYet}</p>
            </div>
          )}
          {cvError && <p className="mt-3 text-sm text-red-600">{cvError}</p>}
        </section>

        {/* Infos */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
          <h2 className="font-bold text-navy-900 mb-4">{t.jobs.yourInfo}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ReadOnly label={t.jobs.fullName} value={candidateName} />
            <ReadOnly label={t.auth.email} value={candidateEmail} />
          </div>
          <div className="mt-4">
            <Field
              label={t.jobs.phone}
              value={phone}
              onChange={setPhone}
              placeholder={t.jobs.phonePlaceholder}
            />
          </div>
        </section>

        {/* Lettre de motivation */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
          <label className="block">
            <span className="font-bold text-navy-900">
              {t.jobs.coverLetterOptional}
            </span>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder={t.jobs.coverLetterPlaceholder}
              className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm resize-none"
            />
          </label>
        </section>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <InteractiveHoverButton
          type="submit"
          disabled={submitting}
          text={submitting ? t.common.loading : t.jobs.sendApplication}
          className="w-full rounded-xl py-3.5 text-base"
        />
      </form>
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <p className="mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 truncate">
        {value}
      </p>
    </div>
  );
}
