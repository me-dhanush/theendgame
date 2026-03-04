import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect("http://localhost:3000/");

  response.cookies.set("session_user", "", {
    expires: new Date(0), // Expire immediately
    path: "/",
  });

  return response;
}
