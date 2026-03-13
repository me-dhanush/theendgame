import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";

function base64url(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const state = randomBytes(16).toString("hex");
  const codeVerifier = base64url(randomBytes(32));
  const codeChallenge = base64url(
    createHash("sha256").update(codeVerifier).digest(),
  );

  const url = new URL("https://lichess.org/oauth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", baseUrl);
  url.searchParams.set("redirect_uri", `${baseUrl}/api/auth/lichess/callback`);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("scope", "challenge:write email:read");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "consent");

  const response = NextResponse.redirect(url);

  response.cookies.set("lichess_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  response.cookies.set("lichess_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
