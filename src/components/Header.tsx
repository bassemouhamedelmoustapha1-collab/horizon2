"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { CategoryIcon, SearchIcon } from "@/components/Icon";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import type { Category } from "@/lib/types";

export default function Header({ categories }: { categories: Category[] }) {
  const { t } = useI18n();
  const user = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuOpen(false);
    // Navigation complète pour recharger le layout sans la session
    window.location.href = "/";
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/jobs?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setQ("");
  }

  const dashboardHref =
    user?.role === "RECRUITER" ? "/recruiter" : "/candidate";

  // Sections de navigation mises en avant
  const navLinks = [
    { href: "/jobs", label: t.nav.jobs },
    { href: "/#entreprises", label: t.nav.companies },
    user?.role === "RECRUITER"
      ? { href: "/recruiter/jobs/new", label: t.nav.postJob }
      : { href: "/register?role=recruiter", label: t.nav.recruiters },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white md:bg-white/95 md:backdrop-blur-md border-b border-slate-200/70 shadow-[0_4px_20px_rgba(16,34,77,0.06)]"
          : "bg-white md:bg-white/70 md:backdrop-blur border-b border-transparent"
      )}
    >
      <div className="container-x flex items-center justify-between h-[68px]">
        <Link
          href="/"
          className="transition-transform hover:scale-[1.03] shrink-0"
        >
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {/* Secteurs — méga-menu */}
          <div
            className="relative"
            onMouseEnter={() => setSectorsOpen(true)}
            onMouseLeave={() => setSectorsOpen(false)}
          >
            <button
              onClick={() => setSectorsOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-3.5 py-2 rounded-full transition-colors",
                sectorsOpen
                  ? "bg-slate-100 text-navy-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
              )}
            >
              {t.nav.sectors}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                className={cn(
                  "transition-transform duration-200",
                  sectorsOpen && "rotate-180"
                )}
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {sectorsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-30">
                <div className="w-[560px] max-w-[90vw] bg-white rounded-2xl border border-slate-100 card-shadow-lg p-4 grid grid-cols-2 gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/jobs?category=${cat.slug}`}
                      onClick={() => setSectorsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                        <CategoryIcon slug={cat.slug} size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-navy-900 truncate">
                          {cat.name}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {cat._count?.jobs ?? 0}{" "}
                          {(cat._count?.jobs ?? 0) === 1
                            ? t.home.openPositionsOne
                            : t.home.openPositions}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => {
            const base = link.href.split("#")[0];
            const active =
              base !== "/" &&
              (pathname === base || pathname.startsWith(base + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-full transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Recherche rapide */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t.common.search}
              className={cn(
                "grid place-items-center w-9 h-9 rounded-full transition-colors",
                searchOpen
                  ? "bg-slate-100 text-navy-900"
                  : "text-slate-500 hover:bg-slate-100 hover:text-navy-900"
              )}
            >
              <SearchIcon size={17} />
            </button>

            {searchOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSearchOpen(false)}
                />
                <form
                  onSubmit={submitSearch}
                  className="absolute right-0 top-full mt-3 z-20 w-72 bg-white rounded-2xl border border-slate-100 card-shadow-lg p-2 flex items-center gap-1"
                >
                  <SearchIcon size={16} className="text-slate-400 ml-2 shrink-0" />
                  <input
                    ref={searchInputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="w-full py-2 text-sm outline-none bg-transparent"
                  />
                </form>
              </>
            )}
          </div>

          <div className="hidden md:block h-6 w-px bg-slate-200" />
          <LanguageToggle />

          {!user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-navy-900 transition-colors"
              >
                {t.common.signIn}
              </Link>
              <InteractiveHoverButton
                href="/register"
                text={t.common.signUp}
                className="px-4 py-2"
              />
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:border-brand-300"
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:block text-sm font-medium text-navy-900 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-100 card-shadow py-2 z-20">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-navy-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                        {user.role === "RECRUITER"
                          ? t.auth.recruiter
                          : t.auth.candidate}
                      </span>
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t.common.dashboard}
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t.common.signOut}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            className="md:hidden grid place-items-center w-9 h-9 rounded-lg border border-slate-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white max-h-[calc(100vh-68px)] overflow-y-auto">
          <div className="container-x py-3 flex flex-col gap-1">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 mb-2"
            >
              <SearchIcon size={16} className="text-slate-400 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full text-sm outline-none bg-transparent"
              />
            </form>

            <Link
              href="/jobs"
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm font-medium text-slate-700"
            >
              {t.nav.jobs}
            </Link>

            <p className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t.nav.sectors}
            </p>
            <div className="grid grid-cols-2 gap-1 mb-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/jobs?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-slate-700"
                >
                  <CategoryIcon slug={cat.slug} size={16} className="text-brand-600 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-medium text-slate-700"
                >
                  {t.common.signIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-semibold text-brand-700"
                >
                  {t.common.signUp}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
