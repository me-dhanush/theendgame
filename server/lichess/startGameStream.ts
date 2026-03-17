import { prisma } from "@/lib/prisma";
import { readNdjsonStream } from "@/lib/readNdjsonStream";

export async function startGameStream(gameIds: string[], streamId: string) {
  const res = await fetch(`https://lichess.org/api/stream/games/${streamId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
      "Content-Type": "text/plain",
    },
    body: gameIds.join(","),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lichess stream failed: ${text}`);
  }

  await readNdjsonStream<any>(res, async (game) => {
    console.log(`[${streamId}]`, game.id, game.statusName);
    await updateMatchFromStream(game);
  });
}

async function updateMatchFromStream(game: any) {
  if (!game.statusName) return;

  const dbGame = await prisma.game.findUnique({
    where: { lichessId: game.id },
  });

  if (!dbGame) return;

  if (game.statusName === "started") {
    await prisma.game.update({
      where: { id: dbGame.id },
      data: { status: "started" },
    });

    await prisma.match.update({
      where: { id: dbGame.matchId },
      data: { status: "started" },
    });

    return;
  }

  const finishedStates = [
    "mate",
    "resign",
    "stalemate",
    "timeout",
    "draw",
    "outoftime",
    "cheat",
    "noStart",
    "unknownFinish",
    "insufficientMaterialClaim",
    "variantEnd",
  ];

  if (!finishedStates.includes(game.statusName)) return;

const alreadyFinished = ["mate", "resign", "stalemate", "timeout", "draw"];

if (alreadyFinished.includes(dbGame.status)) return;

  let score1 = 0.5;
  let score2 = 0.5;

  if (game.winner === "white") {
    score1 = 1;
    score2 = 0;
  }

  if (game.winner === "black") {
    score1 = 0;
    score2 = 1;
  }

  let winnerLichessId: string | null = null;

  if (game.winner === "white") {
    winnerLichessId = dbGame.whiteLichessId;
  }

  if (game.winner === "black") {
    winnerLichessId = dbGame.blackLichessId;
  }

await prisma.game.update({
  where: { id: dbGame.id },
  data: {
    status: game.statusName,
    gameWinner: winnerLichessId,
    whiteScore: score1,
    blackScore: score2,
  },
});

// ALWAYS UPDATE MATCH SCORE
await prisma.match.update({
  where: { id: dbGame.matchId },
  data: {
    score1: { increment: score1 },
    score2: { increment: score2 },
  },
});

console.log("Updating match score:", dbGame.matchId, score1, score2);

const drawStates = [
  "draw",
  "stalemate",
  "insufficientMaterialClaim",
  "variantEnd",
];

if (drawStates.includes(game.statusName)) {
  console.log("Draw detected → creating rematch");

  await createRematch(dbGame.matchId);
  return;
}

// WIN CASE
await prisma.match.update({
  where: { id: dbGame.matchId },
  data: {
    status: "finished",
    matchWinner: winnerLichessId,
  },
});
}

async function createRematch(matchId: string) {
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

  // get last game to know previous colors
  const lastGame = await prisma.game.findFirst({
    where: { matchId: match.id },
    orderBy: { createdAt: "desc" },
  });

  if (!lastGame) throw new Error("Previous game not found");

  // swap colors
  const players = `${lastGame.blackLichessId}:${lastGame.whiteLichessId}`;

  const body = new URLSearchParams({
    players,
    "clock.limit": String(10 * 60),
    "clock.increment": String(0),
    rated: String(tournament.rated),
    variant: "standard",
    rules: "noAbort,noRematch,noGiveTime",
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
