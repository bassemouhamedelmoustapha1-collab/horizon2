"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { BellIcon, CheckIcon } from "@/components/Icon";

/**
 * Carte « créer une alerte » affichée sur la liste des offres (pattern
 * Indeed) : l'alerte reprend la recherche en cours (mot-clé, secteur,
 * ville) et l'e-mail est prérempli pour un utilisateur connecté.
 */
export default function JobAlertCard({
  q,
  category,
  location,
}: {
  q: string;
  category: string;
  location: string;
}) {
  const { t } = useI18n();
  const user = useAuth();

  const [email, setEmail] = useState(user?.email ?? "");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          q: q || undefined,
          category: category || undefined,
          location: location || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("idle");
        setMessage(data.error || t.jobs.alertError);
        return;
      }
      setState("done");
      setMessage(data.duplicate ? t.jobs.alertDuplicate : t.jobs.alertSuccess);
    } catch {
      setState("idle");
      setMessage(t.jobs.alertError);
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-emerald-600 text-white shrink-0">
          <CheckIcon size={18} />
        </span>
        <p className="text-sm font-medium text-emerald-800">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-600 text-white shrink-0">
          <BellIcon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-900 text-sm">
            {t.jobs.alertTitle}
          </p>
          <p className="text-[13px] text-slate-600 mt-0.5">{t.jobs.alertDesc}</p>

          <form
            onSubmit={submit}
            className="mt-3 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.jobs.alertPlaceholder}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-500 text-sm"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 active:scale-[0.98] transition disabled:opacity-60"
            >
              {state === "loading" ? t.common.loading : t.jobs.alertCta}
            </button>
          </form>
          {message && (
            <p className="mt-2 text-[13px] text-red-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
