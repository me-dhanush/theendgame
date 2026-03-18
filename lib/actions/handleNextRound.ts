"use server";

import { generateNextRound } from "@/lib/actions/generateNextRound";
import { prisma } from "@/lib/prisma";

export async function handleNextRound(
  tournamentId: string,
) {
  await generateNextRound(prisma, tournamentId);
}
