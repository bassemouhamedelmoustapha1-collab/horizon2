"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import JobCard from "@/components/JobCard";
import { SearchIcon, MapPinIcon, SlidersIcon, XIcon } from "@/components/Icon";
import { cn } from "@/lib/utils";
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
 *
 * Mobile (pattern Indeed / HelloWork) : recherche « Quoi / Où » sticky
 * sous le header, chips de type défilantes, filtres complets dans une
 * bottom sheet. Desktop : sidebar classique.
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
  const [sheetOpen, setSheetOpen] = useState(false);

  // Barre de recherche mobile : cachée quand on descend, réaffichée dès
  // qu'on remonte (comportement Indeed) — jamais cachée pendant la saisie.
  const [searchHidden, setSearchHidden] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 8) return;
      const typing =
        searchBarRef.current?.contains(document.activeElement) ?? false;
      setSearchHidden(delta > 0 && y > 140 && !typing);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Bottom sheet ouverte : on fige le défilement de la page derrière.
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const count = jobs.length;
  const hasFilters = !!(q || category || type || location);
  const activeCount = [category, location].filter(Boolean).length;

  function resetAll() {
    setQ("");
    setCategory("");
    setType("");
    setLocation("");
  }

  const countLabel = isPending
    ? t.common.loading
    : `${count} ${count === 1 ? t.jobs.resultsFoundOne : t.jobs.resultsFound}`;

  const inputCls =
    "w-full py-2.5 text-[15px] outline-none bg-transparent placeholder:text-slate-400";

  return (
    <div className="pb-6">
      {/* ============ Recherche sticky (mobile uniquement) ============ */}
      <div
        ref={searchBarRef}
        className={cn(
          "lg:hidden sticky top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 will-change-transform transition-[transform,box-shadow] duration-300 ease-out",
          !searchHidden && "shadow-[0_4px_16px_rgba(16,34,77,0.05)]"
        )}
        style={{
          transform: searchHidden
            ? "translateY(calc(-100% - 68px))"
            : "translateY(0)",
        }}
      >
        <div className="container-x py-3 space-y-2.5">
          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
            <div className="flex items-center gap-2.5 px-3.5">
              <SearchIcon size={17} className="text-slate-400 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className={inputCls}
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  aria-label="Effacer"
                  className="text-slate-400 p-1 -mr-1"
                >
                  <XIcon size={15} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5 px-3.5">
              <MapPinIcon size={17} className="text-slate-400 shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.jobs.filterLocation}
                className={inputCls}
              />
            </div>
          </div>

          {/* Chips : bouton Filtres + types de contrat */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            <button
              onClick={() => setSheetOpen(true)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-colors",
                activeCount > 0
                  ? "bg-navy-900 text-white border-navy-900"
                  : "border-slate-200 text-slate-700 bg-white"
              )}
            >
              <SlidersIcon size={14} />
              {t.jobs.filters}
              {activeCount > 0 && (
                <span className="ml-0.5 grid place-items-center w-4.5 h-4.5 min-w-[18px] rounded-full bg-white/20 text-[11px]">
                  {activeCount}
                </span>
              )}
            </button>
            {TYPES.map((ty) => (
              <button
                key={ty}
                onClick={() => setType(type === ty ? "" : ty)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-colors",
                  type === ty
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-200 text-slate-700 bg-white"
                )}
              >
                {t.jobType[ty]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x pt-5 lg:py-10">
        {/* Titre : discret sur mobile, complet sur desktop */}
        <div className="mb-4 lg:mb-8">
          <h1 className="hidden lg:block text-3xl font-bold text-navy-900">
            {t.jobs.title}
          </h1>
          <p className="text-sm lg:mt-1 text-slate-500">{countLabel}</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filtres desktop (sidebar) */}
          <aside className="hidden lg:block lg:sticky lg:top-24 h-max space-y-5 bg-white rounded-2xl border border-slate-100 p-5 card-shadow">
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

            {hasFilters && (
              <button
                onClick={resetAll}
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
                {hasFilters && (
                  <button
                    onClick={resetAll}
                    className="mt-4 text-sm text-brand-600 font-medium hover:underline"
                  >
                    {t.jobs.resetFilters}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ Bottom sheet des filtres (mobile) ============ */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            aria-label={t.common.cancel}
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-navy-900/50 overlay-fade"
          />
          <div
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl sheet-up max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="sticky top-0 bg-white pt-3 pb-2 px-5 border-b border-slate-100 flex items-center justify-between">
              <span className="absolute left-1/2 -translate-x-1/2 top-1.5 h-1 w-10 rounded-full bg-slate-200" />
              <h2 className="mt-2 text-base font-bold text-navy-900">
                {t.jobs.filters}
              </h2>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label={t.common.cancel}
                className="mt-2 p-2 -mr-2 text-slate-500"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {t.jobs.filterCategory}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full px-3.5 py-3 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-[15px] bg-white"
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
                <div className="mt-2 flex flex-wrap gap-2">
                  {TYPES.map((ty) => (
                    <button
                      key={ty}
                      onClick={() => setType(type === ty ? "" : ty)}
                      className={cn(
                        "px-3.5 py-2 rounded-full border text-[13px] font-medium transition-colors",
                        type === ty
                          ? "bg-brand-600 text-white border-brand-600"
                          : "border-slate-200 text-slate-700"
                      )}
                    >
                      {t.jobType[ty]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  {t.jobs.filterLocation}
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dakar, Abidjan..."
                  className="mt-1.5 w-full px-3.5 py-3 rounded-xl border border-slate-200 outline-none focus:border-brand-500 text-[15px]"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-3 flex items-center gap-3">
              {hasFilters && (
                <button
                  onClick={resetAll}
                  className="shrink-0 text-sm text-slate-600 font-medium px-2"
                >
                  {t.jobs.resetFilters}
                </button>
              )}
              <button
                onClick={() => setSheetOpen(false)}
                className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-semibold text-[15px] active:bg-brand-700"
              >
                {t.jobs.showResults}
                {!isPending && ` (${count})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
