export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bulkId = searchParams.get("bulkId");

  if (!bulkId) {
    return new Response("Missing bulkId", { status: 400 });
  }

  const lichessRes = await fetch(
    `https://lichess.org/api/bulk-pairing/${bulkId}/games?moves=false`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        Accept: "application/x-ndjson",
      },
    },
  );

  return new Response(lichessRes.body, {
    headers: {
      "Content-Type": "application/x-ndjson",
    },
  });
}
