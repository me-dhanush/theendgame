"use server";

import { prisma } from "@/lib/prisma";

export async function generateRound1(tournamentId: string) {
  const members = await prisma.tournamentMember.findMany({
    where: { tournamentId },
  });

  if (members.length % 2 !== 0) {
    throw new Error("Players must be even");
  }

  const round = await prisma.round.create({
    data: {
      tournamentId,
      roundNumber: 1,
    },
  });

  const matches = [];

  for (let i = 0; i < members.length; i += 2) {
    matches.push({
      roundId: round.id,
      player1Id: members[i].id,
      player2Id: members[i + 1].id,
    });
  }

  await prisma.match.createMany({
    data: matches,
  });

  return round;
}
