"use server";

import { prisma } from "@/lib/prisma";

export async function createTournament(name: string, hostId: string) {
  const tournament = await prisma.tournament.create({
    data: {
      name,
      hostId,
    },
  });

  return tournament;
}