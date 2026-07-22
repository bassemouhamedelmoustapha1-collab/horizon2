"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps {
  text: string;
  /** Si fourni, le bouton devient un lien (next/link). */
  href?: string;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  /** Couleur de base. @default "bg-brand-600" */
  baseClassName?: string;
  /** Couleur du libellé au repos. @default "text-white" */
  textClassName?: string;
  /** Couleur de remplissage au survol. @default "bg-navy-900" */
  fillClassName?: string;
  /** Classes supplémentaires (largeur, marges…). */
  className?: string;
}

/**
 * Bouton d'appel à l'action interactif : au survol, le libellé s'efface,
 * un remplissage circulaire recouvre le bouton et une flèche apparaît.
 * Fonctionne comme <button> ou, si `href` est fourni, comme lien.
 * Largeur flexible (contrairement au composant d'origine en `w-32`).
 */
export function InteractiveHoverButton({
  text,
  href,
  type = "button",
  onClick,
  disabled,
  baseClassName = "bg-brand-600",
  textClassName = "text-white",
  fillClassName = "bg-navy-900",
  className,
}: InteractiveHoverButtonProps) {
  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer",
    baseClassName,
    disabled && "opacity-60 pointer-events-none",
    className
  );

  const inner = (
    <>
      {/* Libellé au repos */}
      <span
        className={cn(
          "relative z-10 inline-flex items-center whitespace-nowrap transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-0",
          textClassName
        )}
      >
        {text}
      </span>

      {/* Libellé + flèche au survol */}
      <span className="absolute inset-0 z-20 flex items-center justify-center gap-2 whitespace-nowrap text-white opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        {text}
        <ArrowRight className="h-4 w-4" />
      </span>

      {/* Remplissage circulaire qui recouvre le bouton (invisible au repos) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-1/2 z-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-500 ease-out group-hover:h-[260%] group-hover:w-[130%] group-hover:rounded-2xl group-hover:opacity-100",
          fillClassName
        )}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {inner}
    </button>
  );
}

export default InteractiveHoverButton;
