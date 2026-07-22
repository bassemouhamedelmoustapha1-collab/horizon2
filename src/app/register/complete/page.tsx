"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Field } from "@/components/ui/Field";
import { RoleCard } from "@/components/ui/RoleCard";
import { UserIcon, BuildingIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import CompanyLogo from "@/components/CompanyLogo";

export default function CompleteOAuthSignupPage() {
  const { t } = useI18n();

  const [loadingPending, setLoadingPending] = useState(true);
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/oauth/complete")
      .then(async (res) => {
        if (!res.ok) {
          setExpired(true);
          return;
        }
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setPicture(data.picture || null);
      })
      .finally(() => setLoadingPending(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/auth/oauth/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, companyName }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    window.location.href = role === "RECRUITER" ? "/recruiter" : "/candidate";
  }

  if (loadingPending) {
    return <div className="min-h-[calc(100vh-4rem)]" />;
  }

  if (expired) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <p className="text-slate-600">{t.auth.oauthSessionExpired}</p>
          <Link
            href="/login"
            className="mt-4 inline-block text-brand-600 font-semibold hover:underline"
          >
            {t.common.signIn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 sm:p-12">
      <form onSubmit={submit} className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          {picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={picture}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <CompanyLogo name={name || email} className="w-12 h-12 rounded-full" />
          )}
          <div className="min-w-0">
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-navy-900">
          {t.auth.completeProfileTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t.auth.completeProfileSubtitle}
        </p>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700 mb-2">{t.auth.iAm}</p>
          <div className="grid grid-cols-2 gap-3">
            <RoleCard
              active={role === "CANDIDATE"}
              onClick={() => setRole("CANDIDATE")}
              icon={<UserIcon size={22} />}
              title={t.auth.candidate}
              desc={t.auth.candidateDesc}
            />
            <RoleCard
              active={role === "RECRUITER"}
              onClick={() => setRole("RECRUITER")}
              icon={<BuildingIcon size={22} />}
              title={t.auth.recruiter}
              desc={t.auth.recruiterDesc}
            />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Field label={t.auth.name} value={name} onChange={setName} required />
          {role === "RECRUITER" && (
            <Field
              label={t.auth.companyName}
              value={companyName}
              onChange={setCompanyName}
              placeholder="Ex: Sonatel"
            />
          )}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <InteractiveHoverButton
          type="submit"
          disabled={submitting}
          text={submitting ? t.common.loading : t.common.submit}
          className="mt-6 w-full rounded-xl py-3 text-base"
        />
      </form>
    </div>
  );
}
