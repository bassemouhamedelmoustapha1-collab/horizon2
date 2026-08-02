import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Catégories + nombre d'offres, mises en cache 5 minutes.
 *
 * Cette requête était exécutée vers Neon à CHAQUE rendu de page (layout,
 * accueil, liste des offres) — un aller-retour us-east-1 payé par tous les
 * visiteurs. Les catégories ne changent presque jamais et les compteurs
 * peuvent être en retard de quelques minutes sans conséquence.
 */
export const getCategoriesCached = unstable_cache(
  async () =>
    prisma.category.findMany({
      include: { _count: { select: { jobs: true } } },
      orderBy: { name: "asc" },
    }),
  ["categories-with-counts"],
  { revalidate: 300 }
);
