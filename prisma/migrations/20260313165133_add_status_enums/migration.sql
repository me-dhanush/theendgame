/*
  Warnings:

  - You are about to drop the column `lichessUrl` on the `Match` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('pending', 'started', 'finished', 'cancelled');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('pending', 'started', 'finished');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "lichessUrl",
ADD COLUMN     "lichessGameId" TEXT,
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "status" "TournamentStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lichessToken" TEXT;
