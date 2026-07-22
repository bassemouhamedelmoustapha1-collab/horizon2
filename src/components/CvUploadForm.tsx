"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { FileIcon, DownloadIcon } from "@/components/Icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function CvUploadForm({
  initialCvUrl,
  initialCvFileName,
}: {
  initialCvUrl: string | null;
  initialCvFileName: string | null;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [cvUrl, setCvUrl] = useState(initialCvUrl);
  const [cvFileName, setCvFileName] = useState(initialCvFileName);
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
      setError(t.candidate.cvErrorFormat);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(t.candidate.cvErrorSize);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/candidate/cv", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || t.candidate.cvErrorGeneric);
      return;
    }
    setCvUrl(data.cvUrl);
    setCvFileName(data.cvFileName);
    router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  }

  async function removeCv() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/candidate/cv", { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setCvUrl(null);
      setCvFileName(null);
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 card-shadow">
      <h2 className="text-lg font-bold text-navy-900">{t.candidate.myCv}</h2>
      <p className="mt-1 text-sm text-slate-500">{t.candidate.cvHint}</p>

      {cvUrl ? (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
            <FileIcon size={26} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-navy-900 truncate">
              {cvFileName || t.candidate.myCv}
            </p>
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline mt-0.5"
            >
              <DownloadIcon size={15} />
              {t.candidate.downloadCv}
            </a>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <InteractiveHoverButton
              onClick={pickFile}
              disabled={loading}
              text={loading ? t.common.loading : t.candidate.changeCv}
              className="px-4 py-2 text-sm"
            />
            {!loading && (
              <button
                onClick={removeCv}
                className="text-sm text-red-600 hover:underline"
              >
                {t.candidate.removeCv}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-5">
          <span className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center shrink-0">
            <FileIcon size={26} />
          </span>
          <InteractiveHoverButton
            onClick={pickFile}
            disabled={loading}
            text={loading ? t.common.loading : t.candidate.uploadCv}
            className="px-5 py-2"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={onFileSelected}
      />

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
