import { NextResponse } from "next/server";

export async function POST() {
  const tokenWhite = process.env.LICHESS_TOKEN!;
  const tokenBlack = process.env.LICHESS_SECOND!;

  const body = new URLSearchParams({
    players: `${tokenWhite}:${tokenBlack}`,
    "clock.limit": "300", // 5 minutes
    "clock.increment": "3", // +3 seconds
    rated: "false",
    variant: "standard",
    rules: "noAbort,noRematch,noGiveTime,noEarlyDraw",
    message: "Your tournament game vs {opponent} is ready!\n\nClick the link to start your match:\n{game}\n\nGood luck and enjoy the game!",
  });

  const res = await fetch("https://lichess.org/api/bulk-pairing", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${tokenWhite}`,
    },
    body,
  });

  const data = await res.json();

  return NextResponse.json(data);
}
