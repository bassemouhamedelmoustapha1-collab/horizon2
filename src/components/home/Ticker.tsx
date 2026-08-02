"use client";

import { useI18n } from "@/lib/i18n/context";

// Secteurs couverts par la plateforme (pas de marques réelles :
// on n'affiche des noms d'entreprises que lorsqu'elles ont publié une offre).
const SECTORS = [
  "Informatique & Tech",
  "Finance & Comptabilité",
  "Santé",
  "Marketing & Communication",
  "Logistique & Transport",
  "Éducation & Formation",
  "Agriculture",
  "Ressources Humaines",
  "Service Client",
  "Développement Business",
];

/** Bande des secteurs représentés — défilement lent. */
export default function Ticker() {
  const { t } = useI18n();
  const track = [...SECTORS, ...SECTORS];

  return (
    <section
      id="entreprises"
      className="border-y border-slate-100 bg-white py-6 scroll-mt-20"
    >
      <div className="container-x">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-400 mb-4">
          {t.home.trustedBy}
        </p>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12">
            {track.map((name, i) => (
              <span
                key={i}
                className="shrink-0 text-lg font-semibold text-slate-300 select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
