import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import NewJobForm from "@/components/NewJobForm";
import type { Category } from "@/lib/types";

export default async function NewJobPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "RECRUITER") redirect("/candidate");

  const [categoriesRaw, user] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { companyName: true, name: true, logoUrl: true },
    }),
  ]);
  const categories = JSON.parse(JSON.stringify(categoriesRaw)) as Category[];

  return (
    <NewJobForm
      categories={categories}
      companyName={user?.companyName || user?.name || "Entreprise"}
      initialLogoUrl={user?.logoUrl ?? null}
    />
  );
}
