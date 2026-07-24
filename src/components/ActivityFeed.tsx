"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/context";
import { formatRelative } from "@/lib/format";

export type Tone = "neutral" | "blue" | "green" | "red" | "amber";

export type ActivityItem = {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  time: string; // ISO
  href?: string;
  tone?: Tone;
  unread?: boolean;
};

const TONE: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-500",
  blue: "bg-brand-50 text-brand-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
  amber: "bg-amber-50 text-amber-600",
};

export default function ActivityFeed({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: ActivityItem[];
  emptyLabel: string;
}) {
  const { lang } = useI18n();

  return (
    <section className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-bold text-navy-900">{title}</h2>
        {items.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-sm text-slate-400 text-center">
          {emptyLabel}
        </p>
      ) : (
        <ul className="divide-y divide-slate-50">
          {items.map((it) => {
            const Row = (
              <div
                className={`flex gap-3 px-5 py-3.5 transition-colors ${
                  it.href ? "hover:bg-slate-50" : ""
                }`}
              >
                <span
                  className={`shrink-0 grid place-items-center w-9 h-9 rounded-full ${
                    TONE[it.tone ?? "neutral"]
                  }`}
                >
                  {it.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-navy-900 leading-snug">
                    {it.unread && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 mr-1.5 align-middle" />
                    )}
                    {it.title}
                  </p>
                  {it.subtitle && (
                    <p className="text-xs text-slate-500 truncate">
                      {it.subtitle}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">
                  {formatRelative(it.time, lang)}
                </span>
              </div>
            );
            return (
              <li key={it.id}>
                {it.href ? <Link href={it.href}>{Row}</Link> : Row}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
