"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  SearchIcon,
  InboxIcon,
  UserIcon,
} from "@/components/Icon";
import type { ReactNode } from "react";

/**
 * Barre d'onglets fixée en bas, mobile uniquement — le pattern de
 * navigation des applis Indeed / HelloWork. Masquée sur les fiches
 * d'offre et le formulaire de candidature, où le bas d'écran est
 * occupé par le bouton « Candidater ».
 */
export default function MobileTabBar() {
  const { t } = useI18n();
  const user = useAuth();
  const pathname = usePathname();

  // /jobs/<id> et /jobs/<id>/apply : la barre laisse place au CTA.
  if (/^\/jobs\/[^/]+/.test(pathname)) return null;

  const dashboardHref =
    user?.role === "RECRUITER" ? "/recruiter" : "/candidate";
  const profileHref =
    user?.role === "RECRUITER" ? "/recruiter/settings" : "/candidate/settings";

  const tabs: { href: string; label: string; icon: ReactNode; active: boolean }[] = [
    {
      href: "/",
      label: t.tabs.home,
      icon: <HomeIcon size={21} />,
      active: pathname === "/",
    },
    {
      href: "/jobs",
      label: t.tabs.jobs,
      icon: <SearchIcon size={21} />,
      active: pathname.startsWith("/jobs"),
    },
    user
      ? {
          href: dashboardHref,
          label: t.tabs.activity,
          icon: <InboxIcon size={21} />,
          active:
            pathname === dashboardHref ||
            pathname.startsWith(`${dashboardHref}/jobs`) ||
            pathname.startsWith(`${dashboardHref}/applications`),
        }
      : {
          href: "/login",
          label: t.tabs.login,
          icon: <UserIcon size={21} />,
          active: pathname === "/login",
        },
    user
      ? {
          href: profileHref,
          label: t.tabs.profile,
          icon: <UserIcon size={21} />,
          active: pathname.startsWith(profileHref),
        }
      : {
          href: "/register",
          label: t.common.signUp,
          icon: <InboxIcon size={21} />,
          active: pathname === "/register",
        },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigation mobile"
    >
      <div className="grid grid-cols-4">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 pt-2.5 text-[11px] font-medium transition-colors",
              tab.active ? "text-brand-600" : "text-slate-500 active:text-navy-900"
            )}
          >
            {tab.icon}
            <span className="truncate max-w-[5.5rem]">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
