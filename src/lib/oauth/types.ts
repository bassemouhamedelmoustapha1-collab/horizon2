export type OAuthProviderId = "google" | "facebook" | "linkedin" | "apple";

/** Profil normalisé, quel que soit le fournisseur d'origine. */
export interface OAuthProfile {
  providerAccountId: string;
  email: string | null;
  /** null pour Apple hors toute première connexion (voir apple.ts). */
  name: string | null;
  picture: string | null;
}

export interface OAuthCallbackResult {
  profile: OAuthProfile;
}
