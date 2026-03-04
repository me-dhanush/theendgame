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
  const state = randomBytes(16).toString("hex");
  const codeVerifier = base64url(randomBytes(32));
  const codeChallenge = base64url(
    createHash("sha256").update(codeVerifier).digest(),
  );

  const url = new URL("https://lichess.org/oauth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", "http://localhost:3000");
  url.searchParams.set(
    "redirect_uri",
    "http://localhost:3000/api/auth/lichess/callback",
  );
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("scope", "email:read");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);

  response.cookies.set("lichess_state", state);
  response.cookies.set("lichess_verifier", codeVerifier);

  return response;
}
