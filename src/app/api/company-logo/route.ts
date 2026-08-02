import { NextResponse } from "next/server";
import { previewLogoUrl } from "@/lib/company-logo";

/**
 * GET /api/company-logo?name=Orange
 *
 * Résout le domaine d'une entreprise à partir de son nom et renvoie une URL
 * de logo directement affichable — sans rien stocker. Sert d'aperçu en direct
 * dans le formulaire d'inscription/paramètres du recruteur.
 *
 * Réponse : { domain, logoUrl } ou { logoUrl: null } si introuvable.
 */
export async function GET(req: Request) {
  const name = new URL(req.url).searchParams.get("name")?.trim();
  if (!name) {
    return NextResponse.json(
      { error: "Paramètre « name » requis." },
      { status: 400 }
    );
  }

  const result = await previewLogoUrl(name);
  if (!result) {
    return NextResponse.json({ logoUrl: null });
  }

  return NextResponse.json(result);
}
