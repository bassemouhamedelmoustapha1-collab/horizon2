import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import CvUploadForm from "@/components/CvUploadForm";

export default async function CandidateSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "CANDIDATE") redirect("/recruiter");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "fr";
  const t = getDictionary(lang);

  return (
    <div className="container-x py-10 max-w-2xl">
      <Link
        href="/candidate"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6"
      >
        ← {user.name}
      </Link>

      <h1 className="text-3xl font-bold text-navy-900 mb-8">
        {t.candidate.settingsTitle}
      </h1>

      <CvUploadForm
        initialCvUrl={user.cvUrl}
        initialCvFileName={user.cvFileName}
      />
    </div>
  );
}
