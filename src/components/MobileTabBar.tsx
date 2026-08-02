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
 *
 * Animations : l'icône de l'onglet actif « pop » avec un rebond, une
 * pastille s'allume derrière elle et un indicateur s'étire au-dessus ;
 * chaque tap a un retour d'échelle immédiat.
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
            aria-current={tab.active ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[11px] font-medium select-none",
              "transition-transform duration-150 active:scale-90",
              tab.active ? "text-brand-600" : "text-slate-500"
            )}
          >
            {/* Indicateur au-dessus de l'onglet actif */}
            {tab.active && (
              <span
                className="tab-indicator absolute top-0 h-[3px] w-9 rounded-b-full bg-brand-600"
                aria-hidden="true"
              />
            )}
            {/* Icône + pastille : re-jouées à chaque changement d'onglet */}
            <span
              key={tab.active ? pathname : undefined}
              className="relative grid place-items-center h-7 w-13 min-w-[3.25rem]"
            >
              {tab.active && (
                <span
                  className="tab-pill absolute inset-0 rounded-full bg-brand-50"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative transition-colors duration-200",
                  tab.active && "tab-pop"
                )}
              >
                {tab.icon}
              </span>
            </span>
            <span
              className={cn(
                "truncate max-w-[5.5rem] transition-all duration-200",
                tab.active && "font-semibold"
              )}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
