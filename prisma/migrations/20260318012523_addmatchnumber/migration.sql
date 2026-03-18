/*
  Warnings:

  - You are about to drop the column `matchWinner` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roundId,matchNumber]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matchNumber` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "matchWinner",
ADD COLUMN     "matchNumber" INTEGER NOT NULL,
ADD COLUMN     "matchWinnerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Match_roundId_matchNumber_key" ON "Match"("roundId", "matchNumber");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchWinnerId_fkey" FOREIGN KEY ("matchWinnerId") REFERENCES "TournamentMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
