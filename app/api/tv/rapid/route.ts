import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // important for streaming

export async function GET() {
  const response = await fetch("https://lichess.org/api/tv/rapid/feed", {
    headers: {
      Accept: "application/x-ndjson",
    },
  });

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "application/x-ndjson",
    },
  });
}
