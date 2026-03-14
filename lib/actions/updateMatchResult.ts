"use server";

import { prisma } from "@/lib/prisma";

export async function updateMatchResult(
  matchId: string,
  score1: number,
  score2: number,
  lichessGameId?: string,
) {
  return prisma.match.update({
    where: { id: matchId },
    data: {
      score1,
      score2,
      lichessGameId,
    },
  });
}
