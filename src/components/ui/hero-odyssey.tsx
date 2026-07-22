"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { SearchIcon, MapPinIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

/* -------------------------------------------------------------------------- */
/*  Étiquette flottante — met en avant un chiffre clé                          */
/* -------------------------------------------------------------------------- */

interface FeatureItemProps {
  name: string;
  value: string;
  position: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ name, value, position }) => (
  <div
    className={`absolute ${position} z-10 group transition-all duration-300 hover:scale-110`}
  >
    <div className="flex items-center gap-2 relative">
      <div className="relative">
        <div className="w-2 h-2 bg-white rounded-full" />
        <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="text-white relative">
        <div className="font-semibold leading-tight">{name}</div>
        <div className="text-white/60 text-sm">{value}</div>
        <div className="absolute -inset-2 bg-white/10 rounded-lg blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  HeroOdyssey — hero d'Horizon, fond sombre (sans shader)                    */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function HeroOdyssey({ totalJobs }: { totalJobs: number }) {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  // Parallaxe discrète du décor, pilotée par le scroll de la section
  // (pas une boucle : le mouvement suit exactement le doigt/la molette).
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const beamY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const sphereY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  }

  const popular = ["Développeur", "Comptable", "Commercial", "Chargé de projet"];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-navy-900 text-white overflow-hidden"
    >
      {/* Contenu (s'estompe et remonte légèrement au scroll) */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[600px] lg:min-h-[680px] flex flex-col justify-center py-16"
      >
        {/* Étiquettes flottantes (masquées sur mobile) */}
        <div className="hidden lg:block">
          <FeatureItem
            name={`${totalJobs}`}
            value={t.home.statsJobs}
            position="left-0 top-10"
          />
          <FeatureItem
            name="10"
            value={t.home.statCountries}
            position="left-4 bottom-16"
          />
          <FeatureItem
            name="10"
            value={t.home.statCompanies}
            position="right-0 top-10"
          />
          <FeatureItem
            name="FR · EN"
            value={t.home.bilingual}
            position="right-4 bottom-16"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-30 flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/80 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            {t.common.tagline}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08]"
          >
            {t.home.heroTitle1}
            <br />
            <span className="bg-gradient-to-r from-brand-300 via-white to-brand-200 bg-clip-text text-transparent">
              {t.home.heroTitle2}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 text-base sm:text-lg text-white/60 max-w-xl"
          >
            {t.home.heroSubtitle}
          </motion.p>

          {/* Recherche */}
          <motion.form
            variants={itemVariants}
            onSubmit={search}
            className="mt-8 w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2 flex flex-col sm:flex-row gap-2 focus-within:border-white/25 transition-colors"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3">
              <SearchIcon className="text-white/40 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full py-3 text-sm outline-none bg-transparent placeholder:text-white/40"
              />
            </div>
            <div className="flex items-center gap-2.5 px-3 sm:border-l border-white/10">
              <MapPinIcon className="text-white/40 shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.jobs.filterLocation}
                className="w-full sm:w-32 py-3 text-sm outline-none bg-transparent placeholder:text-white/40"
              />
            </div>
            <InteractiveHoverButton
              type="submit"
              text={t.common.search}
              className="rounded-xl px-6 py-3"
            />
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-sm text-white/40">
              {t.home.popularSearches} :
            </span>
            {popular.map((term) => (
              <button
                key={term}
                onClick={() =>
                  router.push(`/jobs?q=${encodeURIComponent(term)}`)
                }
                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 hover:border-white/30 hover:text-white transition-colors"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Décor de fond (CSS, sans shader) — parallaxe pilotée par le scroll */}
      <div className="absolute inset-0 z-0">
        {/* Faisceau lumineux central */}
        <motion.div
          style={{ y: beamY }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-full bg-gradient-to-b from-brand-500/25 via-brand-600/5 to-transparent blur-2xl"
        />
        {/* Halo bleu diffus */}
        <motion.div
          style={{ y: haloY }}
          className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full bg-gradient-to-b from-brand-500/20 to-brand-700/5 blur-3xl"
        />
        {/* Voile sombre en bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-900/60" />
        {/* Sphère/planète */}
        <motion.div
          style={{ y: sphereY }}
          className="absolute top-[64%] left-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_25%_90%,_#1e386b_12%,_#0a142ee6_65%,_#0a142e_100%)]"
        />
      </div>

      {/* Fondu vers le contenu clair en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white z-10" />
    </section>
  );
}

export default HeroOdyssey;
