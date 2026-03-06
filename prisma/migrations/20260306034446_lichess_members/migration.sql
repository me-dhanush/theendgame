/*
  Warnings:

  - You are about to drop the column `userId` on the `TournamentMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tournamentId,lichessId]` on the table `TournamentMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lichessId` to the `TournamentMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TournamentMember" DROP CONSTRAINT "TournamentMember_userId_fkey";

-- DropIndex
DROP INDEX "TournamentMember_tournamentId_userId_key";

-- DropIndex
DROP INDEX "TournamentMember_userId_idx";

-- AlterTable
ALTER TABLE "TournamentMember" DROP COLUMN "userId",
ADD COLUMN     "lichessId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TournamentMember_lichessId_idx" ON "TournamentMember"("lichessId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentMember_tournamentId_lichessId_key" ON "TournamentMember"("tournamentId", "lichessId");

-- AddForeignKey
ALTER TABLE "TournamentMember" ADD CONSTRAINT "TournamentMember_lichessId_fkey" FOREIGN KEY ("lichessId") REFERENCES "User"("lichessId") ON DELETE CASCADE ON UPDATE CASCADE;
