"use client";

import { useI18n } from "@/lib/i18n/context";
import { GoogleIcon, AppleIcon, FacebookIcon, LinkedInIcon } from "@/components/BrandIcons";

const PROVIDERS = [
  { id: "google", Icon: GoogleIcon, label: "Google" },
  { id: "apple", Icon: AppleIcon, label: "Apple" },
  { id: "facebook", Icon: FacebookIcon, label: "Facebook" },
  { id: "linkedin", Icon: LinkedInIcon, label: "LinkedIn" },
] as const;

export default function SocialAuthButtons({
  role,
}: {
  /** Rôle souhaité si un nouveau compte doit être créé (page inscription). */
  role?: "CANDIDATE" | "RECRUITER";
}) {
  const { t } = useI18n();

  return (
    <div className="my-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {t.auth.orContinueWith}
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2.5">
        {PROVIDERS.map(({ id, Icon, label }) => (
          <a
            key={id}
            href={`/api/auth/oauth/${id}${role ? `?role=${role}` : ""}`}
            title={label}
            aria-label={`${t.auth.continueWith} ${label}`}
            className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Icon size={19} className={id === "apple" ? "text-navy-900" : ""} />
          </a>
        ))}
      </div>
    </div>
  );
}
