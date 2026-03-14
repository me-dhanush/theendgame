import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const users = await prisma.user.findMany({
      where: {
        lichessToken: { not: null },
      },
      take: 2,
    });

    if (users.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 users with Lichess tokens" },
        { status: 400 },
      );
    }

    const white = users[0];
    const black = users[1];

    const body = new URLSearchParams({
      players: `${white.lichessToken}:${black.lichessToken}`,
      "clock.limit": "300",
      "clock.increment": "3",
      rated: "false",
      variant: "standard",
      rules: "noRematch,noGiveTime,noEarlyDraw",
      message:
        "♟ Tournament Match\n\nYour game vs {opponent} is ready!\n\nClick the link to start your match:\n{game}",
    });

    const res = await fetch("https://lichess.org/api/bulk-pairing", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    return NextResponse.json({
      white: white.username,
      black: black.username,
      lichessGame: `https://lichess.org/${data.games[0].id}`,
    });
  } catch (error) {
    console.error("Match creation failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
