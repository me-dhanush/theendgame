/*
  Warnings:

  - Made the column `score1` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score2` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "score1" SET NOT NULL,
ALTER COLUMN "score1" SET DEFAULT 0,
ALTER COLUMN "score2" SET NOT NULL,
ALTER COLUMN "score2" SET DEFAULT 0;
