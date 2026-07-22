"use client";

import { useI18n } from "@/lib/i18n/context";
import Reveal from "@/components/Reveal";
import { UserIcon, BuildingIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function CtaSplit() {
  const { t } = useI18n();

  return (
    <section className="container-x py-16">
      <div className="grid md:grid-cols-2 gap-6">
        <Reveal animation="fade-up" className="h-full">
          <div className="h-full rounded-3xl bg-white p-8 lg:p-10 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-brand-50 grid place-items-center text-brand-600">
              <UserIcon size={24} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-navy-900">
              {t.home.forCandidates}
            </h3>
            <p className="mt-2 text-slate-600 max-w-sm leading-relaxed">
              {t.home.forCandidatesDesc}
            </p>
            <InteractiveHoverButton
              href="/register?role=candidate"
              text={t.home.getStarted}
              className="mt-6 px-5 py-2.5"
            />
          </div>
        </Reveal>

        <Reveal animation="fade-up" delay={80} className="h-full">
          <div className="h-full rounded-3xl bg-navy-900 p-8 lg:p-10 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 grid place-items-center text-white">
              <BuildingIcon size={24} />
            </div>
            <h3 className="mt-5 text-2xl font-bold">{t.home.forRecruiters}</h3>
            <p className="mt-2 text-slate-300 max-w-sm leading-relaxed">
              {t.home.forRecruitersDesc}
            </p>
            <InteractiveHoverButton
              href="/register?role=recruiter"
              text={t.nav.postJob}
              baseClassName="bg-white"
              textClassName="text-navy-900"
              fillClassName="bg-brand-600"
              className="mt-6 px-5 py-2.5"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
