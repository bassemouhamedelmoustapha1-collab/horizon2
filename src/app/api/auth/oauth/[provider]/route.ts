import { NextResponse } from "next/server";
import {
  getAuthorizeUrl,
  isProviderConfigured,
  OAUTH_PROVIDERS,
  type OAuthProviderId,
} from "@/lib/oauth";
import { createOAuthState } from "@/lib/oauth/state";

// GET /api/auth/oauth/:provider?role=CANDIDATE|RECRUITER
// Démarre le flux : redirige l'utilisateur vers l'écran de consentement
// du fournisseur choisi.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams, origin } = new URL(req.url);

  if (!OAUTH_PROVIDERS.includes(provider as OAuthProviderId)) {
    return NextResponse.json({ error: "Fournisseur inconnu." }, { status: 404 });
  }

  // Identifiants absents : on évite d'envoyer vers l'écran d'erreur du
  // fournisseur et on affiche un message clair côté connexion.
  if (!isProviderConfigured(provider as OAuthProviderId)) {
    return NextResponse.redirect(
      `${origin}/login?error=oauth_not_configured&provider=${provider}`
    );
  }

  const roleParam = searchParams.get("role");
  const role =
    roleParam === "CANDIDATE" || roleParam === "RECRUITER" ? roleParam : undefined;

  const state = await createOAuthState(role);
  const baseUrl = process.env.APP_URL || origin;
  const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;

  const authorizeUrl = getAuthorizeUrl(provider as OAuthProviderId, redirectUri, state);
  return NextResponse.redirect(authorizeUrl);
}
