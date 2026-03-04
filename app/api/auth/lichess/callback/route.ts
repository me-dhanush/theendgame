import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const savedState = req.cookies.get("lichess_state")?.value;
    const verifier = req.cookies.get("lichess_verifier")?.value;

    // Validate state + required params
    if (!code || !state || state !== savedState) {
      return new NextResponse("Invalid state", { status: 400 });
    }

    if (!verifier) {
      return new NextResponse("Missing PKCE verifier", { status: 400 });
    }

    // Exchange authorization code for access token
    const tokenRes = await fetch("https://lichess.org/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/api/auth/lichess/callback",
        client_id: "http://localhost:3000",
        code_verifier: verifier,
      }),
    });

    if (!tokenRes.ok) {
      return new NextResponse("Token exchange failed", { status: 400 });
    }

    const tokenData = await tokenRes.json();

    // Fetch user profile from Lichess
    const profileRes = await fetch("https://lichess.org/api/account", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileRes.ok) {
      return new NextResponse("Failed to fetch profile", { status: 400 });
    }

    const profile = await profileRes.json();

    // Save or update user in database
    const user = await prisma.user.upsert({
      where: { lichessId: profile.id },
      update: {
        username: profile.username,
      },
      create: {
        lichessId: profile.id,
        username: profile.username,
      },
    });

    // Create response + session cookie
    const response = NextResponse.redirect("http://localhost:3000/dashboard");

    response.cookies.set("session_user", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    // Clean temporary OAuth cookies
    response.cookies.delete("lichess_state");
    response.cookies.delete("lichess_verifier");

    return response;
  } catch (error) {
    console.error("OAuth Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
