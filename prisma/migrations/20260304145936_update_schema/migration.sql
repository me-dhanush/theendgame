-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentMember" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "TournamentMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "player1Id" TEXT,
    "player2Id" TEXT,
    "score1" INTEGER,
    "score2" INTEGER,
    "lichessUrl" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tournament_hostId_idx" ON "Tournament"("hostId");

-- CreateIndex
CREATE INDEX "TournamentMember_tournamentId_idx" ON "TournamentMember"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentMember_userId_idx" ON "TournamentMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentMember_tournamentId_userId_key" ON "TournamentMember"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "Round_tournamentId_idx" ON "Round"("tournamentId");

-- CreateIndex
CREATE INDEX "Match_roundId_idx" ON "Match"("roundId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentMember" ADD CONSTRAINT "TournamentMember_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentMember" ADD CONSTRAINT "TournamentMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "TournamentMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "TournamentMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;
