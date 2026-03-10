"use server";

import { prisma } from "@/lib/prisma";

export async function getTournamentById(id: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        host: true,

        members: {
          include: {
            user: true,
          },
        },

        rounds: {
          orderBy: {
            roundNumber: "asc",
          },
          include: {
            matches: {
              include: {
                player1: {
                  include: { user: true },
                },
                player2: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    return tournament;
  } catch (error) {
    console.error("getTournamentById error:", error);
    throw new Error("Failed to fetch tournament");
  }
}
