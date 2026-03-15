"use server";

import { prisma } from "@/lib/prisma";

export async function updateMatchResult(
  matchId: string,
  score1: number,
  score2: number,
  lichessGameId?: string,
) {
  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      score1,
      score2,
      status: "finished",
    },
  });

  if (lichessGameId) {
    await prisma.game.upsert({
      where: { lichessId: lichessGameId },
      update: {},
      create: {
        matchId: matchId,
        lichessId: lichessGameId,
      },
    });
  }

  return match;
}
