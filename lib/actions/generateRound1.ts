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

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: {
      name: true,
      timeMinutes: true,
      timeIncrement: true,
      rated: true,
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

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
    "clock.limit": String(tournament.timeMinutes * 60),
    "clock.increment": String(tournament.timeIncrement),
    rated: String(tournament.rated),
    variant: "standard",
    rules: "noAbort,noRematch,noGiveTime,noEarlyDraw",
    message:
      `♟ ${tournament.name}\n\n` +
      `Your tournament match against {opponent} is ready!\n\n` +
      `⏱ Time Control: ${tournament.timeMinutes}+${tournament.timeIncrement}\n\n` +
      `▶ Play your game:\n{game}`,
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
  const gameIds: string[] = [];

  await Promise.all(
    data.games.map(async (game: any) => {
      gameIds.push(game.id);

      const match = await prisma.match.findFirst({
        where: {
          roundId: round1.id,
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
        include: {
          player1: { include: { user: true } },
          player2: { include: { user: true } },
        },
      });

      if (!match) {
        console.error("Match not found for game:", game.id);
        return;
      }

      await prisma.game.create({
        data: {
          matchId: match.id,
          lichessId: game.id,
          whiteLichessId: game.white,
          blackLichessId: game.black,
        },
      });
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
