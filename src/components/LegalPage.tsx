import type { ReactNode } from "react";

/** Gabarit commun des pages légales (confidentialité, conditions, contact). */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-x py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-navy-900">{title}</h1>
      {updated && (
        <p className="mt-1 text-sm text-slate-400">
          Dernière mise à jour : {updated}
        </p>
      )}
      <div className="mt-8 space-y-8 text-slate-600 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy-900 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-brand-600 [&_a]:font-medium hover:[&_a]:underline">
        {children}
      </div>
    </div>
  );
}
