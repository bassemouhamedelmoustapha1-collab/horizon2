import { NextResponse } from "next/server";
import {
  fetchProfile,
  resolveOAuthUser,
  OAUTH_PROVIDERS,
  type OAuthProviderId,
} from "@/lib/oauth";
import { verifyOAuthState } from "@/lib/oauth/state";
import { storePendingSignup } from "@/lib/oauth/pending";
import { createSession } from "@/lib/auth";

async function handleCallback(
  req: Request,
  provider: string,
  fields: { code: string | null; state: string | null; appleUser?: string | null }
) {
  const { origin } = new URL(req.url);
  const loginError = (reason: string) =>
    NextResponse.redirect(`${origin}/login?error=${reason}`);

  if (!OAUTH_PROVIDERS.includes(provider as OAuthProviderId)) {
    return loginError("oauth_unknown_provider");
  }
  const providerId = provider as OAuthProviderId;

  const { code, state, appleUser } = fields;
  const { valid } = await verifyOAuthState(state);
  if (!valid) return loginError("oauth_state");
  if (!code) return loginError("oauth_missing_code");

  const baseUrl = process.env.APP_URL || origin;
  const redirectUri = `${baseUrl}/api/auth/oauth/${providerId}/callback`;

  try {
    const profile = await fetchProfile(providerId, code, redirectUri, appleUser);
    const result = await resolveOAuthUser(providerId, profile);

    if (result.status === "signed-in") {
      await createSession({
        userId: result.userId,
        role: result.role,
        name: result.name,
      });
      const dashboard = result.role === "RECRUITER" ? "/recruiter" : "/candidate";
      return NextResponse.redirect(`${origin}${dashboard}`);
    }

    // Nouveau compte : il manque le rôle (candidat/recruteur).
    await storePendingSignup(providerId, profile);
    return NextResponse.redirect(`${origin}/register/complete`);
  } catch (err) {
    console.error(`[oauth:${providerId}] échec du callback`, err);
    return loginError("oauth_failed");
  }
}

// Google, Facebook, LinkedIn redirigent en GET (?code=&state=).
export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);
  return handleCallback(req, provider, {
    code: searchParams.get("code"),
    state: searchParams.get("state"),
  });
}

// Apple répond obligatoirement par un POST (response_mode=form_post).
export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const formData = await req.formData().catch(() => null);
  return handleCallback(req, provider, {
    code: (formData?.get("code") as string) ?? null,
    state: (formData?.get("state") as string) ?? null,
    appleUser: (formData?.get("user") as string) ?? null,
  });
}
