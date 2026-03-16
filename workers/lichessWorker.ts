import dotenv from "dotenv";
dotenv.config();
import { prisma } from "@/lib/prisma";
import { startGameStream } from "@/server/lichess/startGameStream";
import { GameStatus } from "@prisma/client";

const activeStreams = new Set<string>();

async function checkTournaments() {
  const tournaments = await prisma.tournament.findMany({
    select: {
      id: true,
    },
  });

  for (const tournament of tournaments) {
    if (activeStreams.has(tournament.id)) continue;

    const games = await prisma.game.findMany({
      where: {
        status: {
          in: [GameStatus.created, GameStatus.started],
        },
        match: {
          round: {
            tournamentId: tournament.id,
          },
        },
      },
      select: {
        lichessId: true,
      },
    });

    const gameIds = games.map((g) => g.lichessId).filter(Boolean) as string[];

    if (gameIds.length === 0) continue;

    const streamId = `TheEndGameChess-${tournament.id}`;

    console.log(`Starting stream ${streamId} for ${gameIds.length} games`);

    activeStreams.add(tournament.id);

    startGameStream(gameIds, streamId).catch((err) => {
      console.error(`Stream failed for ${streamId}`, err);
      activeStreams.delete(tournament.id);
    });
  }
}

async function startWorker() {
  console.log("Lichess worker started");

  while (true) {
    try {
      await checkTournaments();
    } catch (err) {
      console.error("Worker error", err);
    }

    await new Promise((r) => setTimeout(r, 5000));
  }
}

startWorker();
