import { NextResponse } from "next/server";

export async function GET() {
  const bulkId = "2UGcKNVg";

  const res = await fetch(
    `https://lichess.org/api/bulk-pairing/${bulkId}/games`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        Accept: "application/x-ndjson",
      },
    },
  );

  const text = await res.text();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
