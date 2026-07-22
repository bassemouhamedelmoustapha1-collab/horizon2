"use client";

import { useI18n } from "@/lib/i18n/context";
import JobCard from "@/components/JobCard";
import Reveal from "@/components/Reveal";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import type { Job } from "@/lib/types";

export default function FeaturedJobs({ jobs }: { jobs: Job[] }) {
  const { t } = useI18n();

  return (
    <section className="bg-slate-50/70 py-16">
      <div className="container-x">
        <Reveal animation="fade-up">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
              {t.home.featuredTitle}
            </h2>
            <p className="mt-2 text-slate-500">{t.home.featuredSubtitle}</p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {jobs.map((job, i) => (
            <Reveal key={job.id} animation="fade-up" delay={(i % 4) * 70}>
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <InteractiveHoverButton
            href="/jobs"
            text={t.home.viewAll}
            className="px-7 py-3"
          />
        </div>
      </div>
    </section>
  );
}
