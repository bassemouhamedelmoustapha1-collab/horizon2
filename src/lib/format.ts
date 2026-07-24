import type { Lang } from "./i18n/dictionaries";

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = "XOF"
) {
  if (!min && !max) return null;
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${currency}`;
  if (min) return `À partir de ${fmt(min)} ${currency}`;
  return `Jusqu'à ${fmt(max!)} ${currency}`;
}

export function formatDate(date: string | Date, lang: Lang = "fr") {
  return new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Temps relatif court : « à l'instant », « il y a 2 h », « il y a 3 j »… */
export function formatRelative(date: string | Date, lang: Lang = "fr") {
  const d = new Date(date).getTime();
  const diff = Date.now() - d;
  const min = Math.floor(diff / 60000);
  const fr = lang === "fr";
  if (min < 1) return fr ? "à l'instant" : "just now";
  if (min < 60) return fr ? `il y a ${min} min` : `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return fr ? `il y a ${h} h` : `${h}h ago`;
  const j = Math.floor(h / 24);
  if (j < 7) return fr ? `il y a ${j} j` : `${j}d ago`;
  return formatDate(date, lang);
}

// Couleur d'accent déterministe par entreprise (pour les avatars des cartes)
const ACCENTS = [
  "bg-brand-600",
  "bg-navy-800",
  "bg-accent-orange",
  "bg-accent-teal",
  "bg-brand-500",
  "bg-indigo-600",
  "bg-rose-500",
  "bg-emerald-600",
];

export function accentFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}
