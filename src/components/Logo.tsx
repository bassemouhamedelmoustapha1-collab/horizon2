import { cn } from "@/lib/utils";

/**
 * Logo Horizon — wordmark en police d'affichage (Space Grotesk).
 * Plus d'icône : juste le mot « Horizon », grand, avec un point d'accent.
 */
export default function Logo({
  dark = false,
  className = "",
}: {
  /** true si le logo est posé sur un fond sombre */
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-display font-bold tracking-tight leading-none select-none text-2xl sm:text-[26px]",
        dark ? "text-white" : "text-navy-900",
        className
      )}
    >
      Horizon<span className="text-brand-500">.</span>
    </span>
  );
}
