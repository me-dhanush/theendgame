import { prisma } from "@/lib/prisma";
import { readNdjsonStream } from "@/lib/readNdjsonStream";

export async function startGameStream(gameIds: string[], streamId: string) {

  const res = await fetch(`https://lichess.org/api/stream/games/${streamId}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: gameIds.join(","),
  });

  if (!res.ok) {
    throw new Error("Failed to start Lichess stream");
  }

  await readNdjsonStream<any>(res, async (game) => {
    console.log("Game update:", game.id, game.statusName);

    await updateMatchFromStream(game);
  });
}

async function updateMatchFromStream(game: any) {
  if (!game.statusName) return;

  // mark match started
  if (game.statusName === "started") {
    await prisma.match.updateMany({
      where: { lichessGameId: game.id },
      data: { status: "started" },
    });
    return;
  }

  const finishedStates = [
    "mate",
    "resign",
    "draw",
    "timeout",
    "stalemate",
    "aborted",
  ];

  if (!finishedStates.includes(game.statusName)) return;

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

  await prisma.match.updateMany({
    where: { lichessGameId: game.id },
    data: {
      status: "finished",
      score1,
      score2,
    },
  });
}