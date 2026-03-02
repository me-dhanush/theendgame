import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.LICHESS_TOKEN) {
      return NextResponse.json(
        { error: "Lichess token not configured" },
        { status: 500 },
      );
    }

    const { whiteUsername, blackUsername } = await req.json();

    if (!whiteUsername || !blackUsername) {
      return NextResponse.json(
        { error: "Both whiteUsername and blackUsername are required" },
        { status: 400 },
      );
    }

    const response = await fetch("https://lichess.org/api/challenge/open", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "clock.limit": "300",
        "clock.increment": "1",
        rated: "false",
        variant: "standard",
        name: "Endgame Match",
        users: `${whiteUsername},${blackUsername}`, // 👈 KEY CHANGE
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = JSON.parse(text);

    return NextResponse.json({
      id: data.id,
      url: data.url,
      status: data.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server failed to create challenge" },
      { status: 500 },
    );
  }
}
