/*
  Warnings:

  - Added the required column `rated` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeIncrement` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeMinutes` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "score1" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "score2" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "rated" BOOLEAN NOT NULL,
ADD COLUMN     "timeIncrement" INTEGER NOT NULL,
ADD COLUMN     "timeMinutes" INTEGER NOT NULL;
