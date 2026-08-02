import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { AuthProvider, type PublicUser } from "@/lib/auth-context";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Lang } from "@/lib/i18n/dictionaries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Police d'affichage réservée au logo "Horizon"
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Horizon — L'emploi en Afrique",
  description:
    "Horizon, la plateforme d'emploi pour l'Afrique. Trouvez un emploi ou recrutez les meilleurs talents.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "fr";

  const user = await getCurrentUser();
  const publicUser: PublicUser = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      }
    : null;

  const categoriesRaw = await prisma.category.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });
  const categories = JSON.parse(JSON.stringify(categoriesRaw));

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${displayFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy-900">
        <LanguageProvider initialLang={lang}>
          <AuthProvider user={publicUser}>
            <ScrollProgress />
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* Espace réservé à la barre d'onglets mobile fixée en bas */}
            <div className="h-16 md:hidden" aria-hidden="true" />
            <MobileTabBar />
            <BackToTop />
            <Analytics />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
