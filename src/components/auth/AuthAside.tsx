"use client";

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import { useI18n } from "@/lib/i18n/context";
import Logo from "@/components/Logo";

// Quelques particules qui montent (positions/tailles/rythmes variés)
const PARTICLES: CSSProperties[] = [
  { left: "12%", bottom: "10%", width: 6, height: 6, animationDuration: "7s", animationDelay: "0s" },
  { left: "28%", bottom: "0%", width: 4, height: 4, animationDuration: "9s", animationDelay: "-3s" },
  { left: "46%", bottom: "16%", width: 8, height: 8, animationDuration: "8s", animationDelay: "-5s" },
  { left: "64%", bottom: "4%", width: 5, height: 5, animationDuration: "10s", animationDelay: "-1s" },
  { left: "80%", bottom: "20%", width: 6, height: 6, animationDuration: "8.5s", animationDelay: "-6s" },
  { left: "90%", bottom: "6%", width: 4, height: 4, animationDuration: "11s", animationDelay: "-2s" },
];

/**
 * Panneau latéral animé des pages Connexion / Inscription :
 * aurore flottante, dégradé conique tournant, faisceau qui balaie,
 * grille en fondu et particules montantes. Contenu par-dessus.
 */
export default function AuthAside({ children }: { children?: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-navy-900 text-white">
      {/* ---------- Décor animé ---------- */}
      <div className="absolute inset-0 -z-0" aria-hidden="true">
        {/* Grille en fondu qui défile */}
        <div
          className="absolute inset-0 auth-grid opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 35%, black, transparent 72%)",
            maskImage:
              "radial-gradient(ellipse at 50% 35%, black, transparent 72%)",
          }}
        />

        {/* Dégradé conique tournant, très diffus */}
        <div
          className="absolute auth-conic opacity-40"
          style={{
            inset: "-40%",
            background:
              "conic-gradient(from 0deg, transparent, rgba(59,109,246,.55) 12%, transparent 32%, rgba(13,148,136,.5) 55%, transparent 78%)",
            filter: "blur(30px)",
          }}
        />

        {/* Blobs d'aurore */}
        <span
          className="aurora-blob"
          style={{ width: "22rem", height: "22rem", background: "#2451eb", opacity: 0.55, top: "-5rem", left: "-4rem" }}
        />
        <span
          className="aurora-blob"
          style={{ width: "20rem", height: "20rem", background: "#0d9488", opacity: 0.5, bottom: "-4rem", right: "-3rem", animationDelay: "-6s" }}
        />
        <span
          className="aurora-blob"
          style={{ width: "16rem", height: "16rem", background: "#6366f1", opacity: 0.45, top: "42%", left: "34%", animationDelay: "-11s" }}
        />

        {/* Faisceau lumineux qui balaie */}
        <div
          className="absolute top-0 h-full w-1/3 auth-beam"
          style={{
            left: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent)",
          }}
        />

        {/* Particules montantes */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="auth-particle absolute rounded-full bg-white/70"
            style={{ ...p, boxShadow: "0 0 12px 2px rgba(147,180,253,.6)" }}
          />
        ))}

        {/* Voile sombre pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-navy-900/40" />
      </div>

      {/* ---------- Contenu ---------- */}
      <Link href="/" className="relative z-10 auth-in inline-block w-max">
        <Logo dark className="text-3xl" />
      </Link>

      <div className="relative z-10">
        <h2 className="auth-in delay-200 text-4xl font-extrabold leading-tight">
          {t.home.heroTitle1}{" "}
          <span className="bg-gradient-to-r from-brand-300 via-white to-brand-200 bg-clip-text text-transparent">
            {t.home.heroTitle2}
          </span>
        </h2>
        <p className="auth-in delay-300 mt-4 text-slate-300 max-w-sm">
          {t.home.heroSubtitle}
        </p>
      </div>

      {children ? (
        <div className="relative z-10 auth-in delay-500">{children}</div>
      ) : (
        <p className="relative z-10 auth-in delay-500 text-sm text-slate-400 max-w-xs">
          {t.common.tagline}
        </p>
      )}
    </div>
  );
}
