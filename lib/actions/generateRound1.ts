import { PrismaClient, TournamentMember } from "@prisma/client";

export async function generateRound1(
  prisma: PrismaClient,
  tournamentId: string,
) {
  const members = await prisma.tournamentMember.findMany({
    where: { tournamentId },
    orderBy: { rating: "desc" },
  });

  const pairs = pairing(members);

  /*
  ROUND 1
  */
  const round1 = await prisma.round.create({
    data: {
      tournamentId,
      roundNumber: 1,
    },
  });

  const matches = pairs.map(([p1, p2]) => ({
    roundId: round1.id,
    player1Id: p1.id,
    player2Id: p2.id,
  }));

  await prisma.match.createMany({
    data: matches,
  });

  /*
  GENERATE FUTURE ROUNDS (EMPTY MATCHES)
  */
  const totalPlayers = members.length;
  const totalRounds = Math.log2(totalPlayers);

  let matchesInRound = pairs.length;

  for (let r = 2; r <= totalRounds; r++) {
    const round = await prisma.round.create({
      data: {
        tournamentId,
        roundNumber: r,
      },
    });

    matchesInRound = matchesInRound / 2;

    const emptyMatches = Array.from({ length: matchesInRound }).map(() => ({
      roundId: round.id,
      player1Id: null,
      player2Id: null,
    }));

    await prisma.match.createMany({
      data: emptyMatches,
    });
  }

  return round1;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pairing(players: TournamentMember[]) {
  if (!Number.isInteger(Math.log2(players.length))) {
    throw new Error("Players must be a power of 2 for knockout.");
  }

  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  const bandSize = sorted.length / 4;

  const band1 = sorted.slice(0, bandSize);
  const band2 = sorted.slice(bandSize, bandSize * 2);
  const band3 = sorted.slice(bandSize * 2, bandSize * 3);
  const band4 = sorted.slice(bandSize * 3);

  const b1 = shuffle(band1);
  const b2 = shuffle(band2);
  const b3 = shuffle(band3);
  const b4 = shuffle(band4);

  const pairs: [TournamentMember, TournamentMember][] = [];

  // Band1 vs Band3
  for (let i = 0; i < band1.length; i++) {
    pairs.push([b1[i], b3[i]]);
  }

  // Band2 vs Band4
  for (let i = 0; i < band2.length; i++) {
    pairs.push([b2[i], b4[i]]);
  }

  return shuffle(pairs);
}
