"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import LogoUploadForm from "@/components/LogoUploadForm";
import type { Category, JobType } from "@/lib/types";

const TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "REMOTE",
];

// Devises acceptées (alignées sur jobSchema côté serveur).
const CURRENCIES = [
  "XOF",
  "XAF",
  "NGN",
  "GHS",
  "KES",
  "MAD",
  "MRU",
  "RWF",
  "USD",
  "EUR",
];

const inputCls =
  "mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500";

export default function NewJobForm({
  categories,
  companyName,
  initialLogoUrl,
}: {
  categories: Category[];
  companyName: string;
  initialLogoUrl: string | null;
}) {
  const { t } = useI18n();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("XOF");
  // Champs enrichis
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [benefits, setBenefits] = useState("");
  const [positions, setPositions] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        categoryId,
        location,
        type,
        salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
        currency,
        responsibilities: responsibilities || undefined,
        requirements: requirements || undefined,
        experience: experience || undefined,
        education: education || undefined,
        skills: skills || undefined,
        benefits: benefits || undefined,
        positions: positions ? parseInt(positions, 10) : undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    router.refresh();
    router.push("/recruiter");
  }

  return (
    <div className="container-x py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-navy-900">
        {t.recruiter.postNewJob}
      </h1>
      <p className="mt-1 text-slate-500">
        Publiez votre offre et touchez les meilleurs talents d&apos;Afrique.
      </p>

      {/* Logo de l'entreprise — s'affichera sur toutes vos offres */}
      <div className="mt-8">
        <LogoUploadForm
          companyName={companyName}
          initialLogoUrl={initialLogoUrl}
        />
      </div>

      <form onSubmit={submit} className="mt-5 space-y-5">
        {/* --- Bloc principal --- */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 card-shadow space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              {t.recruiter.jobTitle}
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Développeur Fullstack"
              className={inputCls}
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.recruiter.category}
              </span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`${inputCls} bg-white`}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.recruiter.contractType}
              </span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className={`${inputCls} bg-white`}
              >
                {TYPES.map((ty) => (
                  <option key={ty} value={ty}>
                    {t.jobType[ty]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.recruiter.location}
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Ex: Dakar, Sénégal"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.jobs.positionsLabel}{" "}
                <span className="text-slate-400">({t.recruiter.optional})</span>
              </span>
              <input
                type="number"
                min="1"
                value={positions}
                onChange={(e) => setPositions(e.target.value)}
                placeholder="1"
                className={inputCls}
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.recruiter.salaryMin}
              </span>
              <input
                type="number"
                min="0"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="400000"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.recruiter.salaryMax}
              </span>
              <input
                type="number"
                min="0"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="900000"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.recruiter.currency}
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={inputCls}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              {t.recruiter.jobDescription}
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Présentez le poste en quelques phrases..."
              className={`${inputCls} resize-none`}
            />
          </label>
        </div>

        {/* --- Détails enrichis --- */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 card-shadow space-y-5">
          <h2 className="font-bold text-navy-900">
            {t.recruiter.detailsSection}{" "}
            <span className="text-sm font-normal text-slate-400">
              ({t.recruiter.optional})
            </span>
          </h2>

          <MultiLineField
            label={t.jobs.missions}
            hint={t.recruiter.onePerLine}
            value={responsibilities}
            onChange={setResponsibilities}
            placeholder={"Piloter…\nCollaborer avec…\nAssurer le reporting…"}
          />
          <MultiLineField
            label={t.jobs.profileWanted}
            hint={t.recruiter.onePerLine}
            value={requirements}
            onChange={setRequirements}
            placeholder={"Première expérience réussie…\nAutonomie…"}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.jobs.experienceRequired}
              </span>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Ex: 2 à 3 ans"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                {t.jobs.education}
              </span>
              <input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Ex: Bac+3 à Bac+5"
                className={inputCls}
              />
            </label>
          </div>

          <MultiLineField
            label={t.jobs.skills}
            hint={t.recruiter.onePerLine}
            value={skills}
            onChange={setSkills}
            placeholder={"React & Node.js\nGestion de projet\nAnglais"}
            rows={3}
          />
          <MultiLineField
            label={t.jobs.benefits}
            hint={t.recruiter.onePerLine}
            value={benefits}
            onChange={setBenefits}
            placeholder={"Assurance santé\nFormation continue\nTélétravail partiel"}
            rows={3}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <InteractiveHoverButton
            type="submit"
            disabled={loading}
            text={loading ? t.common.loading : t.recruiter.publish}
            className="flex-1 rounded-xl py-3 text-base"
          />
          <button
            type="button"
            onClick={() => router.push("/recruiter")}
            className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
          >
            {t.common.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}

function MultiLineField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}{" "}
        <span className="text-xs font-normal text-slate-400">· {hint}</span>
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`${inputCls} resize-none`}
      />
    </label>
  );
}
