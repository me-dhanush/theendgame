import { prisma } from "@/lib/prisma";
import { readNdjsonStream } from "@/lib/readNdjsonStream";

export async function startGameStream(gameIds: string[], streamId: string) {
  console.log("🚀 Starting stream", { streamId, gameIds });

  const res = await fetch(`https://lichess.org/api/stream/games/${streamId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
      "Content-Type": "text/plain",
    },
    body: gameIds.join(","),
  });

  console.log("📡 Stream response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Stream failed:", text);
    throw new Error(`Lichess stream failed: ${text}`);
  }

  console.log("✅ Stream connected successfully");

  await readNdjsonStream<any>(res, async (game) => {
    console.log(`🎮 [${streamId}] Incoming game update`, {
      id: game.id,
      status: game.statusName,
      winner: game.winner,
    });

    await updateMatchFromStream(game);
  });
}

async function updateMatchFromStream(game: any) {
  console.log("🔄 Processing game:", game.id);

  if (!game.statusName) {
    console.warn("⚠️ Missing statusName, skipping");
    return;
  }

  const finishedStates = [
    "mate",
    "resign",
    "stalemate",
    "timeout",
    "draw",
    "outoftime",
    "cheat",
    "noStart",
    "unknownFinish",
    "insufficientMaterialClaim",
    "variantEnd",
  ];

  const dbGame = await prisma.game.findUnique({
    where: { lichessId: game.id },
  });

  if (!dbGame) {
    console.warn("⚠️ Game not found in DB:", game.id);
    return;
  }

  console.log("📦 DB Game found:", {
    id: dbGame.id,
    status: dbGame.status,
  });

  if (game.statusName === "started") {
    console.log("▶️ Game started event");

    if (finishedStates.includes(dbGame.status)) {
      console.log("⛔ Already finished, ignoring start");
      return;
    }

    await prisma.game.update({
      where: { id: dbGame.id },
      data: { status: "started" },
    });

    await prisma.match.update({
      where: { id: dbGame.matchId },
      data: { status: "started" },
    });

    console.log("✅ Match + Game marked as started");

    return;
  }

  if (!finishedStates.includes(game.statusName)) {
    console.log("⏳ Not a finished state, skipping:", game.statusName);
    return;
  }

  console.log("🏁 Game finished:", game.statusName);

  const match = await prisma.match.findUnique({
    where: { id: dbGame.matchId },
    include: {
      player1: true,
      player2: true,
    },
  });

  if (!match) {
    console.warn("⚠️ Match not found:", dbGame.matchId);
    return;
  }

  console.log("🤝 Match found:", match.id);

  let score1 = 0.5;
  let score2 = 0.5;

  const isPlayer1White = match.player1?.lichessId === dbGame.whiteLichessId;

  console.log("🎨 Color mapping:", {
    isPlayer1White,
    white: dbGame.whiteLichessId,
    player1: match.player1?.lichessId,
  });

  if (game.winner === "white") {
    console.log("🏆 White wins");

    if (isPlayer1White) {
      score1 = 1;
      score2 = 0;
    } else {
      score1 = 0;
      score2 = 1;
    }
  }

  if (game.winner === "black") {
    console.log("🏆 Black wins");

    if (isPlayer1White) {
      score1 = 0;
      score2 = 1;
    } else {
      score1 = 1;
      score2 = 0;
    }
  }

  console.log("📊 Calculated scores:", { score1, score2 });

  let winnerMemberId: string | null = null;

  if (game.winner === "white") {
    winnerMemberId = isPlayer1White ? match.player1Id : match.player2Id;
  }

  if (game.winner === "black") {
    winnerMemberId = isPlayer1White ? match.player2Id : match.player1Id;
  }

  console.log("🥇 Winner member ID:", winnerMemberId);

  const drawStates = [
    "draw",
    "stalemate",
    "insufficientMaterialClaim",
    "variantEnd",
  ];

  let shouldCreateRematch = false;

  await prisma.$transaction(async (tx) => {
    console.log("🔐 Starting transaction");

    const current = await tx.game.findUnique({
      where: { id: dbGame.id },
      select: { status: true },
    });

    if (!current) {
      console.warn("⚠️ Game disappeared during transaction");
      return;
    }

    if (finishedStates.includes(current.status)) {
      console.log("⛔ Already finished in DB, skipping");
      return;
    }

    await tx.game.update({
      where: { id: dbGame.id },
      data: {
        status: game.statusName,
        gameWinner: game.winner,
        whiteScore: score1,
        blackScore: score2,
      },
    });

    console.log("✅ Game updated in DB");

    if (
      drawStates.includes(game.statusName) &&
      !drawStates.includes(current.status)
    ) {
      shouldCreateRematch = true;
      console.log("♻️ Draw detected → rematch required");
    }

    await tx.match.update({
      where: { id: dbGame.matchId },
      data: {
        score1: { increment: score1 },
        score2: { increment: score2 },
        ...(drawStates.includes(game.statusName)
          ? {}
          : {
              status: "finished",
              matchWinnerId: winnerMemberId,
            }),
      },
    });

    console.log("✅ Match updated in DB");
  });

  console.log("🎯 Final update done:", {
    matchId: dbGame.matchId,
    score1,
    score2,
  });

  if (shouldCreateRematch) {
    console.log("🚀 Creating rematch...");
    await createRematch(dbGame.matchId);
  }
}

async function createRematch(matchId: string) {
  console.log("🔁 Creating rematch for match:", matchId);

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      player1: { include: { user: true } },
      player2: { include: { user: true } },
      round: { include: { tournament: true } },
    },
  });

  if (!match) {
    console.error("❌ Match not found for rematch");
    throw new Error("Match not found");
  }

  console.log("📦 Loaded match for rematch");

  const tournament = match.round.tournament;

  if (
    !match.player1?.user?.lichessToken ||
    !match.player2?.user?.lichessToken
  ) {
    console.error("❌ Missing lichess tokens");
    throw new Error("Missing lichess OAuth token");
  }

  const lastGame = await prisma.game.findFirst({
    where: { matchId: match.id },
    orderBy: { createdAt: "desc" },
  });

  if (!lastGame) {
    console.error("❌ No previous game found");
    throw new Error("Previous game not found");
  }

  console.log("🎮 Last game:", lastGame.id);

  const token1 = match.player1!.user!.lichessToken!;
  const token2 = match.player2!.user!.lichessToken!;

  let whiteToken: string;
  let blackToken: string;

  if (lastGame.whiteLichessId === match.player1!.user!.lichessId) {
    whiteToken = token2;
    blackToken = token1;
  } else {
    whiteToken = token1;
    blackToken = token2;
  }

  const players = `${whiteToken}:${blackToken}`;

  const body = new URLSearchParams({
    players,
    "clock.limit": String(10 * 60),
    "clock.increment": String(0),
    rated: String(tournament.rated),
    variant: "standard",
    rules: "noAbort,noRematch,noGiveTime",
    message:
      `♟ ${tournament.name}\n\n` +
      `Your tournament match against {opponent} is ready!\n\n` +
      `⏱ Time Control: ${tournament.timeMinutes}+${tournament.timeIncrement}\n\n` +
      `▶ Play your game:\n{game}`,
  });

  console.log("📡 Sending rematch request to Lichess");

  const res = await fetch("https://lichess.org/api/bulk-pairing", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Rematch creation failed: ${await res.text()}`);
  }

  const data = await res.json();

  const game = data.games[0];

  console.log("✅ Rematch created:", game.id);

  await prisma.game.create({
    data: {
      matchId: match.id,
      lichessId: game.id,
      whiteLichessId: game.white,
      blackLichessId: game.black,
    },
  });

  // ADD GAME TO EXISTING STREAM
  const streamRes = await fetch(
    `https://lichess.org/api/stream/games/TheEndGameChess-${tournament.id}/add`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LICHESS_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: game.id,
    },
  );

  if (!streamRes.ok) {
    throw new Error(`Failed to add game to stream: ${await streamRes.text()}`);
  }

  console.log("Game added to stream:", game.id);
}
