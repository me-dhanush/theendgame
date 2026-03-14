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

const createdMatches = await prisma.match.findMany({
  where: { roundId: round1.id },
  orderBy: { id: "asc" },
  include: {
    player1: {
      include: {
        user: true,
      },
    },
    player2: {
      include: {
        user: true,
      },
    },
  },
});

const players = createdMatches
  .map((m) => {
    if (!m.player1?.user?.lichessToken || !m.player2?.user?.lichessToken) {
      throw new Error("Missing lichess OAuth token");
    }

    return `${m.player1.user.lichessToken}:${m.player2.user.lichessToken}`;
  })
  .join(",");

  // call lichess bulk pairing
  const body = new URLSearchParams({
    players,
    "clock.limit": "300",
    "clock.increment": "3",
    rated: "false",
    variant: "standard",
    rules: "noRematch,noGiveTime,noEarlyDraw",
    message:
      "♟ Tournament Match\n\nYour game vs {opponent} is ready!\n\nClick the link to start your match:\n{game}",
  });

  const res = await fetch("https://lichess.org/api/bulk-pairing", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Lichess API failed: ${await res.text()}`);
  }

  const data = await res.json();

  await prisma.round.update({
    where: { id: round1.id },
    data: {
      bulkPairingId: data.id,
    },
  });
  // save lichess game ids
await Promise.all(
  data.games.map(async (game: any) => {
    const result = await prisma.match.updateMany({
      where: {
        OR: [
          {
            player1: { user: { lichessId: game.white } },
            player2: { user: { lichessId: game.black } },
          },
          {
            player1: { user: { lichessId: game.black } },
            player2: { user: { lichessId: game.white } },
          },
        ],
      },
      data: {
        lichessGameId: game.id,
      },
    });

    console.log("UPDATE RESULT:", result);
  }),
);

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
