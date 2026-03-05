"use server";

import { prisma } from "@/lib/prisma";

export async function joinTournament(
  tournamentId: string,
  userId: string,
  rating: number,
) {
  return prisma.tournamentMember.create({
    data: {
      tournamentId,
      userId,
      rating,
    },
  });
}
