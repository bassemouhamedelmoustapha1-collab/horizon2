import type { OAuthProfile } from "./types";

const API_VERSION = "v21.0";
const AUTHORIZE_URL = `https://www.facebook.com/${API_VERSION}/dialog/oauth`;
const TOKEN_URL = `https://graph.facebook.com/${API_VERSION}/oauth/access_token`;
const PROFILE_URL = `https://graph.facebook.com/${API_VERSION}/me`;

export function getFacebookAuthorizeUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "email public_profile",
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function fetchFacebookProfile(
  code: string,
  redirectUri: string
): Promise<OAuthProfile> {
  const tokenParams = new URLSearchParams({
    code,
    client_id: process.env.FACEBOOK_CLIENT_ID || "",
    client_secret: process.env.FACEBOOK_CLIENT_SECRET || "",
    redirect_uri: redirectUri,
  });
  const tokenRes = await fetch(`${TOKEN_URL}?${tokenParams.toString()}`);
  if (!tokenRes.ok) {
    throw new Error(`Facebook token exchange failed: ${await tokenRes.text()}`);
  }
  const tokens = (await tokenRes.json()) as { access_token: string };

  const profileParams = new URLSearchParams({
    fields: "id,name,email,picture.type(large)",
    access_token: tokens.access_token,
  });
  const profileRes = await fetch(`${PROFILE_URL}?${profileParams.toString()}`);
  if (!profileRes.ok) {
    throw new Error(`Facebook profile fetch failed: ${await profileRes.text()}`);
  }
  const profile = (await profileRes.json()) as {
    id: string;
    name?: string;
    email?: string;
    picture?: { data?: { url?: string } };
  };

  return {
    providerAccountId: profile.id,
    email: profile.email ?? null,
    name: profile.name ?? null,
    picture: profile.picture?.data?.url ?? null,
  };
}
