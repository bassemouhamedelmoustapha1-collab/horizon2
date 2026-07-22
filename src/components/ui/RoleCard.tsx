"use client";

import type { ReactNode } from "react";

export function RoleCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border-2 p-3.5 transition-colors ${
        active
          ? "border-brand-600 bg-brand-50"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <span
        className={`inline-grid place-items-center w-9 h-9 rounded-lg ${
          active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </span>
      <p className="mt-2.5 font-semibold text-sm text-navy-900">{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
