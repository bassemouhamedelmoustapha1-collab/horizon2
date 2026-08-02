"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import JobCard from "@/components/JobCard";
import type { Job, Category, JobType } from "@/lib/types";

const TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "REMOTE",
];

export type JobsFilters = {
  q: string;
  category: string;
  type: string;
  location: string;
};

/**
 * Explorateur d'offres. Les résultats sont RENDUS PAR LE SERVEUR (SSR,
 * indispensable pour le référencement) : ce composant ne fait que piloter
 * les filtres en mettant à jour l'URL — chaque changement redemande la
 * page au serveur, qui renvoie la liste déjà rendue.
 */
export default function JobsExplorer({
  jobs,
  categories,
  initialFilters,
}: {
  jobs: Job[];
  categories: Category[];
  initialFilters: JobsFilters;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initialFilters.q);
  const [category, setCategory] = useState(initialFilters.category);
  const [type, setType] = useState(initialFilters.type);
  const [location, setLocation] = useState(initialFilters.location);

  // Navigation debouncée : l'URL est la source de vérité, le serveur re-rend.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (type) params.set("type", type);
      if (location) params.set("location", location);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/jobs?${qs}` : "/jobs", { scroll: false });
      });
    }, 300);
    return () => clearTimeout(id);
  }, [q, category, type, location, router]);

  const count = jobs.length;

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">{t.jobs.title}</h1>
        <p className="mt-1 text-slate-500">
          {isPending
            ? t.common.loading
            : `${count} ${count === 1 ? t.jobs.resultsFoundOne : t.jobs.resultsFound}`}
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filtres */}
        <aside className="lg:sticky lg:top-24 h-max space-y-5 bg-white rounded-2xl border border-slate-100 p-5 card-shadow">
          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.common.search}
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.home.searchPlaceholder}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.jobs.filterCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm bg-white"
            >
              <option value="">{t.common.allCategories}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({c._count?.jobs ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.jobs.filterType}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm bg-white"
            >
              <option value="">—</option>
              {TYPES.map((ty) => (
                <option key={ty} value={ty}>
                  {t.jobType[ty]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              {t.jobs.filterLocation}
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dakar, Abidjan..."
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-sm"
            />
          </div>

          {(q || category || type || location) && (
            <button
              onClick={() => {
                setQ("");
                setCategory("");
                setType("");
                setLocation("");
              }}
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              {t.jobs.resetFilters}
            </button>
          )}
        </aside>

        {/* Résultats (déjà rendus par le serveur) */}
        <div className={isPending ? "opacity-60 transition-opacity" : ""}>
          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 text-slate-500">{t.jobs.noResults}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
