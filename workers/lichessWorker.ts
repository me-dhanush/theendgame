import dotenv from "dotenv";
dotenv.config();

import { prisma } from "@/lib/prisma";
import { startGameStream } from "@/server/lichess/startGameStream";
import { GameStatus } from "@prisma/client";

const activeStreams = new Set<string>();

function log(...args: any[]) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

async function checkTournaments() {
  log("Checking tournaments...");

  const tournaments = await prisma.tournament.findMany({
    select: {
      id: true,
    },
  });

  log(`Found ${tournaments.length} tournaments in database`);

  for (const tournament of tournaments) {
    log(`\n----- Tournament ${tournament.id} -----`);

    if (activeStreams.has(tournament.id)) {
      log(`Skipping ${tournament.id} (stream already active)`);
      continue;
    }

    log(`Fetching active games for tournament ${tournament.id}`);

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

    log(`Found ${games.length} candidate games`);

    const gameIds = games.map((g) => g.lichessId).filter(Boolean) as string[];

    log(`Valid Lichess IDs: ${gameIds.length}`);

    if (gameIds.length === 0) {
      log(`No active games for tournament ${tournament.id}, skipping`);
      continue;
    }

    const streamId = `TheEndGameChess-${tournament.id}`;

    log(`Starting Lichess stream`);
    log(`Stream ID: ${streamId}`);
    log(`Games being streamed:`, gameIds);

    activeStreams.add(tournament.id);

    startGameStream(gameIds, streamId)
      .then(() => {
        log(`Stream ${streamId} finished normally`);
        activeStreams.delete(tournament.id);
      })
      .catch((err) => {
        console.error(
          `[${new Date().toISOString()}] Stream FAILED for ${streamId}`,
          err,
        );
        activeStreams.delete(tournament.id);
      });
  }

  log("Tournament check complete\n");
}

async function startWorker() {
  log("================================");
  log("Lichess worker started");
  log("Polling every 5 seconds");
  log("================================");

  while (true) {
    try {
      await checkTournaments();
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Worker fatal error`, err);
    }

    log("Sleeping for 5 seconds...\n");

    await new Promise((r) => setTimeout(r, 5000));
  }
}

startWorker();
