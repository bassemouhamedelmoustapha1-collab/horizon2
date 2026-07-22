"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import CompanyLogo from "@/components/CompanyLogo";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const MAX_SIZE = 2 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export default function LogoUploadForm({
  companyName,
  initialLogoUrl,
}: {
  companyName: string;
  initialLogoUrl: string | null;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function pickFile() {
    inputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!ACCEPTED.includes(file.type)) {
      setError(t.recruiter.logoErrorFormat);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(t.recruiter.logoErrorSize);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/recruiter/logo", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || t.recruiter.logoErrorGeneric);
      setPreview(null);
      return;
    }
    setLogoUrl(data.logoUrl);
    setPreview(null);
    router.refresh();
  }

  async function removeLogo() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/recruiter/logo", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setLogoUrl(null);
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 card-shadow">
      <h2 className="text-lg font-bold text-navy-900">
        {t.recruiter.companyLogo}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{t.recruiter.logoHint}</p>

      <div className="mt-5 flex items-center gap-5">
        <CompanyLogo
          name={companyName}
          logoUrl={preview || logoUrl}
          className="w-20 h-20 rounded-2xl"
          textClassName="text-2xl"
        />

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="hidden"
            onChange={onFileSelected}
          />
          <InteractiveHoverButton
            onClick={pickFile}
            disabled={loading}
            text={
              loading
                ? t.common.loading
                : logoUrl
                  ? t.recruiter.changeLogo
                  : t.recruiter.uploadLogo
            }
            className="px-5 py-2"
          />
          {logoUrl && !loading && (
            <button
              onClick={removeLogo}
              className="text-sm text-red-600 hover:underline text-left"
            >
              {t.recruiter.removeLogo}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
