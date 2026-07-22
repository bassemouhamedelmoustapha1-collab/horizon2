"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { Field } from "@/components/ui/Field";
import Logo from "@/components/Logo";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import SocialAuthButtons from "@/components/SocialAuthButtons";

const OAUTH_ERROR_KEYS: Record<
  string,
  "oauthStateError" | "oauthFailedError" | "oauthNotConfigured"
> = {
  oauth_state: "oauthStateError",
  oauth_missing_code: "oauthFailedError",
  oauth_unknown_provider: "oauthFailedError",
  oauth_failed: "oauthFailedError",
  oauth_not_configured: "oauthNotConfigured",
};

function LoginForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const oauthErrorParam = searchParams.get("error");
  const oauthErrorKey = oauthErrorParam ? OAUTH_ERROR_KEYS[oauthErrorParam] : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t.auth.loginError);
      return;
    }
    // Navigation complète pour que le layout (header) se recharge avec la session
    window.location.href =
      data.user.role === "RECRUITER" ? "/recruiter" : "/candidate";
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-navy-900 text-white p-12">
        <Link href="/" className="anim-fade-down inline-block">
          <Logo dark className="text-3xl" />
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight">
            {t.home.heroTitle1} {t.home.heroTitle2}
          </h2>
          <p className="mt-4 text-slate-300 max-w-sm">{t.home.heroSubtitle}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400 space-y-1.5">
          <p className="font-semibold text-slate-200 mb-1">
            {t.auth.demoAccounts}
          </p>
          <p>
            <span className="text-slate-500">{t.auth.candidate} — </span>
            candidat@horizon.africa
          </p>
          <p>
            <span className="text-slate-500">{t.auth.recruiter} — </span>
            recruteur1@horizon.africa
          </p>
          <p>
            <span className="text-slate-500">{t.auth.password} — </span>
            password123
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-navy-900">
            {t.auth.loginTitle}
          </h1>

          {oauthErrorKey && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {t.auth[oauthErrorKey]}
            </p>
          )}

          <SocialAuthButtons />

          <div className="space-y-4">
            <Field
              label={t.auth.email}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="vous@exemple.com"
              required
            />
            <Field
              label={t.auth.password}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <InteractiveHoverButton
            type="submit"
            disabled={loading}
            text={loading ? t.common.loading : t.common.signIn}
            className="mt-6 w-full rounded-xl py-3 text-base"
          />

          <p className="mt-5 text-sm text-slate-500 text-center">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="text-brand-600 font-semibold">
              {t.common.signUp}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
