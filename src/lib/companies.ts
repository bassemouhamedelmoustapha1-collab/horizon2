/**
 * Correspondance nom d'entreprise → domaine, pour récupérer le logo
 * (via le service Clearbit Logo). Repli sur l'initiale si inconnu.
 */
const DOMAINS: Record<string, string> = {
  Sonatel: "sonatel.sn",
  "Orange Afrique": "orange.com",
  Orange: "orange.com",
  Wave: "wave.com",
  Jumia: "jumia.com",
  Ecobank: "ecobank.com",
  "MTN Group": "mtn.com",
  MTN: "mtn.com",
  "Bolloré Africa": "bollore.com",
  Bolloré: "bollore.com",
  Africell: "africell.com",
  "Baobab Group": "baobabgroup.com",
  Baobab: "baobabgroup.com",
  Senelec: "senelec.sn",
};

export function companyDomain(name: string | null | undefined): string | null {
  if (!name) return null;
  if (DOMAINS[name]) return DOMAINS[name];
  const lower = name.toLowerCase();
  const key = Object.keys(DOMAINS).find((k) =>
    lower.includes(k.toLowerCase())
  );
  return key ? DOMAINS[key] : null;
}

export function companyLogoUrl(name: string | null | undefined): string | null {
  const domain = companyDomain(name);
  // Clearbit ayant fermé son API de logos, on utilise le service d'icônes
  // de Google (fiable) comme repli automatique pour les entreprises connues.
  return domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : null;
}
