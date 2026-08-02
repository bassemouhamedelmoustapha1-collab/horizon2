"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import Reveal from "@/components/Reveal";
import { CategoryIcon, ArrowRightIcon } from "@/components/Icon";
import type { Category } from "@/lib/types";

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  const { t } = useI18n();

  return (
    <section id="secteurs" className="container-x py-16 scroll-mt-20">
      <div className="flex items-end justify-between mb-8">
        <Reveal animation="fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
            {t.home.categoriesTitle}
          </h2>
          <p className="mt-2 text-slate-500">{t.home.categoriesSubtitle}</p>
        </Reveal>
        <Reveal animation="fade-up">
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            {t.common.allCategories}
            <ArrowRightIcon size={16} />
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <Reveal key={cat.id} animation="fade-up" delay={i * 40}>
            <Link
              href={`/jobs?category=${cat.slug}`}
              className="group block h-full bg-white rounded-2xl border border-slate-100 p-5 hover:border-brand-200 hover:shadow-[0_6px_24px_rgba(16,34,77,0.08)] transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 grid place-items-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <CategoryIcon slug={cat.slug} size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-navy-900 text-sm leading-snug">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {cat._count?.jobs ?? 0}{" "}
                {(cat._count?.jobs ?? 0) === 1
                  ? t.home.openPositionsOne
                  : t.home.openPositions}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
