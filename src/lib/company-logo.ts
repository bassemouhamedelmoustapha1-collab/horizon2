import { saveUpload } from "@/lib/storage";
import { companyDomain } from "@/lib/companies";

/**
 * Recherche automatique du logo d'une entreprise à partir de son nom.
 *
 * 1. Résolution du domaine :
 *    - d'abord la table curée (`companyDomain`) pour les entreprises connues ;
 *    - sinon l'API d'autocomplétion Clearbit (sans clé) qui traduit un nom
 *      d'entreprise en domaine (ex. « Orange » → `orange.fr`).
 * 2. Récupération de l'image du logo à partir du domaine via des services
 *    d'icônes publics et fiables (DuckDuckGo puis Google), toujours sans clé.
 *
 * Tout est borné par des délais d'attente : en cas d'échec on renvoie `null`
 * et l'inscription se poursuit normalement (le recruteur pourra téléverser
 * son logo manuellement depuis les paramètres).
 */

/** fetch avec timeout dur (l'inscription ne doit jamais rester bloquée). */
async function fetchWithTimeout(
  url: string,
  ms: number,
  init?: RequestInit
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      redirect: "follow",
      headers: { "User-Agent": "HorizonBot/1.0", ...(init?.headers || {}) },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

type Suggestion = { name?: string; domain?: string };

/** Choisit la suggestion la plus proche du nom saisi. */
function pickBestDomain(query: string, list: Suggestion[]): string | null {
  const q = query.trim().toLowerCase();
  const withDomain = list.filter((s) => s.domain);
  if (withDomain.length === 0) return null;

  const exact = withDomain.find((s) => (s.name || "").toLowerCase() === q);
  if (exact?.domain) return exact.domain;

  const starts = withDomain.find((s) =>
    (s.name || "").toLowerCase().startsWith(q)
  );
  if (starts?.domain) return starts.domain;

  return withDomain[0].domain ?? null;
}

/** Nom d'entreprise → domaine (table curée, sinon Clearbit autocomplete). */
export async function resolveCompanyDomain(
  name: string
): Promise<string | null> {
  const known = companyDomain(name);
  if (known) return known;

  const res = await fetchWithTimeout(
    `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(
      name
    )}`,
    5000
  );
  if (!res || !res.ok) return null;

  const data = (await res.json().catch(() => null)) as Suggestion[] | null;
  if (!Array.isArray(data) || data.length === 0) return null;

  return pickBestDomain(name, data);
}

/** URLs candidates du logo pour un domaine (services publics, sans clé). */
export function logoCandidateUrls(domain: string): string[] {
  return [
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];
}

/**
 * URL de logo directement affichable pour un nom d'entreprise, sans
 * téléchargement (utile pour un aperçu côté client). `null` si inconnu.
 */
export async function previewLogoUrl(
  name: string
): Promise<{ domain: string; logoUrl: string } | null> {
  const domain = await resolveCompanyDomain(name);
  if (!domain) return null;
  return { domain, logoUrl: logoCandidateUrls(domain)[0] };
}

function extFor(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("webp")) return "webp";
  return "ico";
}

/**
 * Recherche, télécharge et stocke durablement le logo d'une entreprise.
 * Renvoie l'URL stockée (Vercel Blob en prod, `/uploads/...` en local),
 * ou `null` si aucun logo exploitable n'a pu être trouvé.
 */
export async function findAndStoreCompanyLogo(
  name: string
): Promise<string | null> {
  const domain = await resolveCompanyDomain(name);
  if (!domain) return null;

  for (const url of logoCandidateUrls(domain)) {
    const res = await fetchWithTimeout(url, 5000);
    if (!res || !res.ok) continue;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) continue;

    const buffer = Buffer.from(await res.arrayBuffer());
    // On écarte les images vides ou les pixels d'erreur de 1×1.
    if (buffer.byteLength < 100) continue;

    const slug =
      domain.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() ||
      "logo";
    const key = `uploads/logos/auto-${slug}-${Date.now()}.${extFor(
      contentType
    )}`;

    try {
      return await saveUpload({ key, buffer, contentType });
    } catch {
      return null;
    }
  }

  return null;
}
