import type { OAuthProfile } from "./types";

const AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

export function getLinkedInAuthorizeUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.LINKEDIN_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function fetchLinkedInProfile(
  code: string,
  redirectUri: string
): Promise<OAuthProfile> {
  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.LINKEDIN_CLIENT_ID || "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`LinkedIn token exchange failed: ${await tokenRes.text()}`);
  }
  const tokens = (await tokenRes.json()) as { access_token: string };

  const profileRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) {
    throw new Error(`LinkedIn userinfo failed: ${await profileRes.text()}`);
  }
  const profile = (await profileRes.json()) as {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  return {
    providerAccountId: profile.sub,
    email: profile.email ?? null,
    name: profile.name ?? null,
    picture: profile.picture ?? null,
  };
}
