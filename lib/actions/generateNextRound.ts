import { PrismaClient } from "@prisma/client";

export async function generateNextRound(
  prisma: PrismaClient,
  tournamentId: string,
) {
  /*
  Get tournament
  */
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  const currentRoundNumber = tournament.currentRoundNumber;

  if (!currentRoundNumber) {
    throw new Error("Current round not set");
  }

  const currentRound = await prisma.round.findFirst({
    where: {
      tournamentId,
      roundNumber: currentRoundNumber,
    },
    include: {
      matches: {
        include: {
          player1: { include: { user: true } },
          player2: { include: { user: true } },
        },
      },
    },
  });

  if (!currentRound) {
    throw new Error("Round not found");
  }

  /*
  Ensure all matches finished
  */
  const unfinished = currentRound.matches.find((m) => m.status !== "finished");

  if (unfinished) {
    throw new Error("Round not finished yet");
  }

  /*
  Collect winners
  */
  const winners = currentRound.matches
    .map((m) => m.matchWinnerId)
    .filter((id): id is string => Boolean(id));

  if (winners.length < 2) {
    throw new Error("Not enough winners for next round");
  }

  /*
  Next round
  */
  const nextRound = await prisma.round.findFirst({
    where: {
      tournamentId,
      roundNumber: currentRoundNumber + 1,
    },
    include: {
      matches: {
        orderBy: { matchNumber: "asc" },
      },
    },
  });

  if (!nextRound) {
    throw new Error("Next round not found");
  }

  /*
  Fill next round matches
  */
  const updates = [];

  for (let i = 0; i < winners.length; i += 2) {
    const match = nextRound.matches[i / 2];

    const p1 = winners[i];
    const p2 = winners[i + 1];

    if (!match || !p1 || !p2) break;

    updates.push(
      prisma.match.update({
        where: { id: match.id },
        data: {
          player1Id: p1,
          player2Id: p2,
        },
      }),
    );
  }

  await prisma.$transaction(updates);

  /*
  Fetch matches again with players
  */
  const readyMatches = await prisma.match.findMany({
    where: { roundId: nextRound.id },
    include: {
      player1: { include: { user: true } },
      player2: { include: { user: true } },
    },
    orderBy: { matchNumber: "asc" },
  });

  /*
  Prepare lichess players
  */
  const players = readyMatches
    .map((m) => {
      const [a, b] =
        Math.random() < 0.5
          ? [m.player1!.user!.lichessToken, m.player2!.user!.lichessToken]
          : [m.player2!.user!.lichessToken, m.player1!.user!.lichessToken];

      return `${a}:${b}`;
    })
    .join(",");

  /*
  Lichess bulk pairing
  */
  const body = new URLSearchParams({
    players,
    "clock.limit": String(tournament.timeMinutes * 60),
    "clock.increment": String(tournament.timeIncrement),
    rated: String(tournament.rated),
    variant: "standard",
    rules: "noAbort,noRematch,noGiveTime",
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
    throw new Error(`Lichess API failed: ${await res.text()}`);
  }

  const data = await res.json();

  /*
  Save bulk pairing id
  */
  await prisma.round.update({
    where: { id: nextRound.id },
    data: { bulkPairingId: data.id },
  });

  /*
  Save lichess games
  */
  await Promise.all(
    data.games.map(async (game: any) => {
      const match = await prisma.match.findFirst({
        where: {
          roundId: nextRound.id,
          OR: [
            {
              player1: { user: { lichessId: game.white } },
              player2: { user: { lichessId: game.black } },
            },
            {
              player1: { user: { lichessId: game.black } },
              player2: { user: { lichessId: game.white } },
            },
          ],
        },
      });

      if (!match) return;

      await prisma.game.create({
        data: {
          matchId: match.id,
          lichessId: game.id,
          whiteLichessId: game.white,
          blackLichessId: game.black,
        },
      });
    }),
  );

  /*
Increment tournament round
*/
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      currentRoundNumber: {
        increment: 1,
      },
    },
  });
  return nextRound;
}
