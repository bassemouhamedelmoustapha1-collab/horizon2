"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-slate-300 mt-20">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:pr-6">
          <Link href="/" className="inline-block mb-4">
            <Logo dark className="text-3xl" />
          </Link>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            {t.footer.about}
          </p>
        </div>

        <FooterCol title={t.footer.candidatesCol}>
          <FooterLink href="/jobs">{t.jobs.title}</FooterLink>
          <FooterLink href="/register?role=candidate">
            {t.common.signUp}
          </FooterLink>
          <FooterLink href="/login">{t.common.signIn}</FooterLink>
        </FooterCol>

        <FooterCol title={t.footer.recruitersCol}>
          <FooterLink href="/register?role=recruiter">
            {t.footer.createAccount}
          </FooterLink>
          <FooterLink href="/recruiter/jobs/new">{t.nav.postJob}</FooterLink>
        </FooterCol>

        <FooterCol title={t.footer.presenceCol}>
          <span className="text-sm text-slate-400 leading-relaxed">
            Dakar · Abidjan · Lagos · Nairobi · Accra · Casablanca · Bamako ·
            Douala · Kigali
          </span>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <span>© {year} Horizon. {t.footer.rights}.</span>
          <nav className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t.footer.terms}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {t.footer.contact}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
      <ul className="space-y-2.5 text-sm flex flex-col">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="text-slate-400 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );
}
