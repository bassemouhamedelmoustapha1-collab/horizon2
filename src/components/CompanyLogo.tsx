"use client";

import { companyLogoUrl } from "@/lib/companies";
import { accentFor } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Affiche le logo de l'entreprise : en priorité le logo uploadé par le
 * recruteur (`logoUrl`), sinon une recherche automatique via Clearbit.
 * L'initiale colorée est toujours rendue en fond ; le logo démarre
 * transparent et n'apparaît (en fondu) qu'une fois chargé avec succès.
 * Une image manquante, bloquée ou en cours de chargement laisse donc
 * simplement voir l'initiale — jamais de carré vide, et aucune mise à
 * jour d'état React (pas d'avertissement).
 */
export default function CompanyLogo({
  name,
  logoUrl,
  className,
  textClassName = "text-base",
}: {
  name: string;
  /** Logo uploadé par le recruteur (chemin `/uploads/logos/...`). */
  logoUrl?: string | null;
  /** Taille + arrondi de la pastille, ex. "w-11 h-11 rounded-xl". */
  className?: string;
  textClassName?: string;
}) {
  const url = logoUrl || companyLogoUrl(name);

  return (
    <span
      className={cn(
        "relative shrink-0 grid place-items-center overflow-hidden font-semibold text-white",
        accentFor(name),
        textClassName,
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          className="absolute inset-0 h-full w-full bg-white object-contain p-1.5 opacity-0 transition-opacity duration-300"
        />
      )}
    </span>
  );
}
