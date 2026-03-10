import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const controller = new AbortController();

    const response = await fetch("https://lichess.org/api/tv/blitz/feed", {
      headers: {
        Accept: "application/x-ndjson",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.body) {
      return NextResponse.json(
        { error: "No stream received" },
        { status: 500 },
      );
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("TV stream error:", error);

    return NextResponse.json(
      { error: "Stream connection failed" },
      { status: 500 },
    );
  }
}
