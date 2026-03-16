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

  if (dbGame.status !== "started") return;

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
    },
  });

  await prisma.match.update({
    where: { id: dbGame.matchId },
    data: {
      status: "finished",
      score1,
      score2,
      matchWinner: winnerLichessId,
    },
  });
}
