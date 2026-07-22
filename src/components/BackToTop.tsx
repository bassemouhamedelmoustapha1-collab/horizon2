"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { ArrowRightIcon } from "@/components/Icon";

export default function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label={t.common.backToTop}
      className={`back-to-top grid place-items-center w-11 h-11 rounded-full bg-navy-900 text-white shadow-[0_8px_24px_rgba(10,20,46,0.35)] hover:bg-brand-600 transition-colors ${
        visible ? "is-visible" : ""
      }`}
    >
      <ArrowRightIcon size={18} className="-rotate-90" />
    </button>
  );
}
