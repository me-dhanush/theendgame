"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Entrant } from "@/lib/pairing";
import { generateRound1 } from "./generateRound1";

export async function createTournament(data: {
  name: string;
  players: Entrant[];
}) {
  console.log("=== CREATE TOURNAMENT START ===");
  console.log("Incoming data:", data);

  const user = await requireUser();
  console.log("Authenticated user:", user);

  /*
  1️⃣ Create Tournament
  */
  const tournament = await prisma.tournament.create({
    data: {
      name: data.name,
      hostId: user.id,
    },
  });

  console.log("Tournament created:", tournament);

  /*
  2️⃣ Create Tournament Members (FAST)
  */
  await prisma.tournamentMember.createMany({
    data: data.players.map((p) => ({
      tournamentId: tournament.id,
      lichessId: p.name,
      rating: p.rating,
    })),
  });

  console.log("Members created");

  /*
  3️⃣ Generate Round 1
  */
  await generateRound1(prisma, tournament.id);

  console.log("Round 1 generated");

  return tournament;
}
