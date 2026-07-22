"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const router = useRouter();

  function toggle() {
    setLang(lang === "fr" ? "en" : "fr");
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
      aria-label="Changer de langue"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {lang === "fr" ? "FR" : "EN"}
    </button>
  );
}
