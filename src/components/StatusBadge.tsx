"use client";

import { useI18n } from "@/lib/i18n/context";
import type { ApplicationStatus } from "@/lib/types";

const STYLES: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  REVIEWED: "bg-blue-50 text-blue-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-600",
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n();
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STYLES[status]}`}
    >
      {t.status[status]}
    </span>
  );
}
