/*
  Warnings:

  - You are about to drop the column `lichessGameId` on the `Match` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('created', 'started', 'aborted', 'mate', 'resign', 'stalemate', 'timeout', 'draw', 'outoftime', 'cheat', 'noStart', 'unknownFinish', 'insufficientMaterialClaim', 'variantEnd');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "lichessGameId",
ADD COLUMN     "matchWinner" TEXT;

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "lichessId" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'started',
    "gameWinner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_lichessId_key" ON "Game"("lichessId");

-- CreateIndex
CREATE INDEX "Game_matchId_idx" ON "Game"("matchId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
