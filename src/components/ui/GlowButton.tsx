import * as React from "react";

type GlowMode = "rotate" | "breathe" | "static";

const BLUR: Record<string, string> = {
  soft: "blur-sm",
  medium: "blur-md",
  strong: "blur-lg",
  stronger: "blur-xl",
};

/**
 * Enveloppe un bouton (ou un lien) d'un léger halo animé.
 * Pensé pour n'être utilisé que sur les 2-3 appels à l'action principaux.
 * Couleurs de la marque par défaut.
 *
 * Le dégradé conique est fixe et c'est la couche qui tourne (les dégradés
 * ne sont pas interpolables ; une rotation l'est et reste fluide). La
 * rotation est faite en CSS pur — l'animation s'interrompt automatiquement
 * si l'utilisateur a activé « réduire les animations » (voir globals.css).
 */
export interface GlowButtonProps {
  children: React.ReactNode;
  /** @default "rotate" */
  mode?: GlowMode;
  /** Couleurs du halo — palette Horizon par défaut. */
  colors?: string[];
  /** @default "strong" */
  blur?: keyof typeof BLUR;
  /** Durée d'un cycle (secondes). @default 7 */
  duration?: number;
  /** Taille du halo par rapport au bouton (>1 = déborde). @default 1.1 */
  glowScale?: number;
  /** Opacité du halo. @default 0.45 */
  intensity?: number;
  /** Classes du halo (rayon des coins). @default "rounded-full" */
  glowClassName?: string;
  /** Classes de l'enveloppe. */
  className?: string;
}

export function GlowButton({
  children,
  mode = "rotate",
  colors = ["#2451eb", "#3b6df6", "#0d9488", "#2451eb"],
  blur = "strong",
  duration = 7,
  glowScale = 1.1,
  intensity = 0.45,
  glowClassName = "rounded-full",
  className,
}: GlowButtonProps) {
  const stops = colors.join(", ");

  const background =
    mode === "breathe"
      ? `radial-gradient(circle at 50% 50%, ${colors[0]} 0%, ${
          colors[1] ?? colors[0]
        } 45%, transparent 72%)`
      : `conic-gradient(from 0deg at 50% 50%, ${stops})`;

  const spinClass =
    mode === "rotate" ? "glow-spin" : mode === "breathe" ? "glow-breathe" : "";

  return (
    <span className={`relative inline-flex isolate ${className ?? ""}`}>
      {/* Conteneur : porte l'échelle, l'opacité et le flou (statiques) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 ${BLUR[blur]}`}
        style={{ transform: `scale(${glowScale})`, opacity: intensity }}
      >
        {/* Couche interne : le dégradé + la rotation CSS */}
        <span
          className={`block h-full w-full ${glowClassName} ${spinClass}`}
          style={
            { background, "--glow-duration": `${duration}s` } as React.CSSProperties
          }
        />
      </span>
      {children}
    </span>
  );
}

export default GlowButton;
