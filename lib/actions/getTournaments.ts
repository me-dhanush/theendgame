"use server";

import { prisma } from "@/lib/prisma";

export async function getTournaments() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        host: true,
        members: true,
        rounds: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return tournaments;
  } catch (error) {
    console.error("Failed to fetch tournaments:", error);
    return [];
  }
}
