import { PrismaClient } from "@prisma/client";

export async function createRematch(prisma: PrismaClient, matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      player1: { include: { user: true } },
      player2: { include: { user: true } },
      round: { include: { tournament: true } },
    },
  });

  if (!match) throw new Error("Match not found");

  const tournament = match.round.tournament;

  if (
    !match.player1?.user?.lichessToken ||
    !match.player2?.user?.lichessToken
  ) {
    throw new Error("Missing lichess OAuth token");
  }

  const players = `${match.player1.user.lichessToken}:${match.player2.user.lichessToken}`;

  const body = new URLSearchParams({
    players,
    "clock.limit": String(10 * 60),
    "clock.increment": String(0),
    rated: String(tournament.rated),
    variant: "standard",
    rules: "noAbort,noRematch,noGiveTime,noEarlyDraw",
    message:
      `♟ ${tournament.name}\n\n` +
      `Your tournament match against {opponent} is ready!\n\n` +
      `⏱ Time Control: ${tournament.timeMinutes}+${tournament.timeIncrement}\n\n` +
      `▶ Play your game:\n{game}`,
  });

  const res = await fetch("https://lichess.org/api/bulk-pairing", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Rematch creation failed: ${await res.text()}`);
  }

  const data = await res.json();

  const game = data.games[0];

  await prisma.game.create({
    data: {
      matchId: match.id,
      lichessId: game.id,
      whiteLichessId: game.white,
      blackLichessId: game.black,
    },
  });

  // ADD GAME TO EXISTING STREAM
  const streamRes = await fetch(
    `https://lichess.org/api/stream/games/TheEndGameChess-${tournament.id}/add`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: game.id,
    },
  );

  if (!streamRes.ok) {
    throw new Error(`Failed to add game to stream: ${await streamRes.text()}`);
  }

  console.log("Game added to stream:", game.id);
}
