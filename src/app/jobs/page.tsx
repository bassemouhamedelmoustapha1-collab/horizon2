"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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

function JobsView() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");

  const [categories, setCategories] = useState<Category[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();
    setJobs(data.jobs ?? []);
    setLoading(false);
  }, [q, category, type, location]);

  // Recherche debouncée
  useEffect(() => {
    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
  }, [load]);

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">{t.jobs.title}</h1>
        <p className="mt-1 text-slate-500">
          {loading ? t.common.loading : `${jobs.length} ${t.jobs.resultsFound}`}
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

        {/* Résultats */}
        <div>
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl shimmer-bg" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
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

export default function JobsPage() {
  return (
    <Suspense>
      <JobsView />
    </Suspense>
  );
}
