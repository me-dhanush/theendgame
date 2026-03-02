export type PlayerType = {
  name: string;
  rating: number;
};

export type MatchType = {
  id: string;
  players: [PlayerType | null, PlayerType | null];
  scores: [number | null, number | null];
  link: string | null;
};

export type RoundType = {
  id: string;
  matches: MatchType[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pairing(players: PlayerType[]) {
  // ✅ Strong validation (must be power of 2)
  if (!Number.isInteger(Math.log2(players.length))) {
    throw new Error("Players must be a power of 2 for knockout.");
  }

  const sorted = [...players].sort((a, b) => b.rating - a.rating);

  const bandSize = Math.ceil(sorted.length / 4);

  const band1 = sorted.slice(0, bandSize);
  const band2 = sorted.slice(bandSize, bandSize * 2);
  const band3 = sorted.slice(bandSize * 2, bandSize * 3);
  const band4 = sorted.slice(bandSize * 3);

  const pairs: [PlayerType, PlayerType][] = [];

  const b1 = shuffle(band1);
  const b2 = shuffle(band2);
  const b3 = shuffle(band3);
  const b4 = shuffle(band4);

  // Band1 vs Band3
  for (let i = 0; i < Math.min(b1.length, b3.length); i++) {
    pairs.push([b1[i], b3[i]]);
  }

  // Band2 vs Band4
  for (let i = 0; i < Math.min(b2.length, b4.length); i++) {
    pairs.push([b2[i], b4[i]]);
  }

  return shuffle(pairs);
}

export function generateRound1Matches(players: PlayerType[]): MatchType[] {
  const pairs = pairing(players);

  return pairs.map(([p1, p2], index) => ({
    id: `r1-m${index + 1}`, // ✅ Fixed ID
    players: [p1, p2],
    scores: [null, null],
    link: null, // ✅ Added
  }));
}

export function generateKnockoutBracket(players: PlayerType[]): RoundType[] {
  // ✅ Strong validation (must be power of 2)
  if (!Number.isInteger(Math.log2(players.length))) {
    throw new Error("Players must be a power of 2 for knockout.");
  }

  const rounds: RoundType[] = [];

  // 🔹 Round 1
  let currentMatches = generateRound1Matches(players);

  rounds.push({
    id: "round-1",
    matches: currentMatches,
  });

  let roundNumber = 2;

  // 🔹 Remaining rounds
  while (currentMatches.length > 1) {
    const nextRoundMatches: MatchType[] = [];

    for (let i = 0; i < currentMatches.length; i += 2) {
      nextRoundMatches.push({
        id: `r${roundNumber}-m${i / 2 + 1}`, // ✅ Fixed round numbering
        players: [null, null],
        scores: [null, null],
        link: null, // ✅ Added
      });
    }

    rounds.push({
      id: `round-${roundNumber}`,
      matches: nextRoundMatches,
    });

    currentMatches = nextRoundMatches;
    roundNumber++;
  }

  return rounds;
}

export const testRounds: RoundType[] = [
  {
    id: "round-1",
    matches: [
      {
        id: "r1-m1",
        players: [
          { name: "Magnus Carlsen", rating: 2850 },
          { name: "Ian Nepomniachtchi", rating: 2745 },
        ],
        scores: [1, 0],
        link: null,
      },
      {
        id: "r1-m2",
        players: [
          { name: "Hikaru Nakamura", rating: 2780 },
          { name: "Alireza Firouzja", rating: 2740 },
        ],
        scores: [0, 1],
        link: null,
      },
      {
        id: "r1-m3",
        players: [
          { name: "Fabiano Caruana", rating: 2760 },
          { name: "Anish Giri", rating: 2730 },
        ],
        scores: [1, 0],
        link: null,
      },
      {
        id: "r1-m4",
        players: [
          { name: "Ding Liren", rating: 2750 },
          { name: "Wesley So", rating: 2725 },
        ],
        scores: [1, 0],
        link: null,
      },
    ],
  },
  {
    id: "round-2",
    matches: [
      {
        id: "r2-m1",
        players: [
          { name: "Magnus Carlsen", rating: 2850 },
          { name: "Alireza Firouzja", rating: 2740 },
        ],
        scores: [null, null],
        link: null,
      },
      {
        id: "r2-m2",
        players: [
          { name: "Fabiano Caruana", rating: 2760 },
          { name: "Ding Liren", rating: 2750 },
        ],
        scores: [null, null],
        link: null,
      },
    ],
  },
  {
    id: "round-3",
    matches: [
      {
        id: "r3-m1",
        players: [null, null],
        scores: [null, null],
        link: null,
      },
    ],
  },
];
