"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { Field } from "@/components/ui/Field";
import { UserIcon, BuildingIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { RoleCard } from "@/components/ui/RoleCard";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import AuthAside from "@/components/auth/AuthAside";

function RegisterForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "recruiter" ? "RECRUITER" : "CANDIDATE";

  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">(initialRole);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, companyName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    // Navigation complète pour recharger le layout avec la nouvelle session
    window.location.href = role === "RECRUITER" ? "/recruiter" : "/candidate";
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <AuthAside />

      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-md">
          <h1 className="auth-in text-2xl font-bold text-navy-900">
            {t.auth.registerTitle}
          </h1>

          <div className="auth-in delay-100 mt-6">
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

          <div className="auth-in delay-200">
            <SocialAuthButtons role={role} />
          </div>

          <div className="auth-in delay-300 space-y-4">
            <Field
              label={t.auth.name}
              value={name}
              onChange={setName}
              placeholder="Aminata Diallo"
              required
            />
            {role === "RECRUITER" && (
              <Field
                label={t.auth.companyName}
                value={companyName}
                onChange={setCompanyName}
                placeholder="Ex: Sonatel"
              />
            )}
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
            text={loading ? t.common.loading : t.common.signUp}
            className="mt-6 w-full rounded-xl py-3 text-base"
          />

          <p className="mt-5 text-sm text-slate-500 text-center">
            {t.auth.hasAccount}{" "}
            <Link href="/login" className="text-brand-600 font-semibold">
              {t.common.signIn}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
