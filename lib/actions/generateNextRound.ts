"use server";

import { prisma } from "@/lib/prisma";

export async function generateNextRound(tournamentId: string) {
  const lastRound = await prisma.round.findFirst({
    where: { tournamentId },
    orderBy: { roundNumber: "desc" },
    include: {
      matches: true,
    },
  });

  if (!lastRound) throw new Error("No rounds found");

  // determine winners
  const winners: string[] = [];

  for (const match of lastRound.matches) {
    if (match.score1 == null || match.score2 == null) {
      throw new Error("All matches must be finished first");
    }

    const winner =
      match.score1 > match.score2 ? match.player1Id : match.player2Id;

    if (winner) winners.push(winner);
  }

  if (winners.length < 2) {
    throw new Error("Tournament finished");
  }

  const nextRoundNumber = lastRound.roundNumber + 1;

  const round = await prisma.round.create({
    data: {
      tournamentId,
      roundNumber: nextRoundNumber,
    },
  });

  const matches = [];

  for (let i = 0; i < winners.length; i += 2) {
    matches.push({
      roundId: round.id,
      player1Id: winners[i],
      player2Id: winners[i + 1],
    });
  }

  await prisma.match.createMany({
    data: matches,
  });

  return round;
}
