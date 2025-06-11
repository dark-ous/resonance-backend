/*
  Warnings:

  - You are about to drop the column `songId` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `spotifySongID` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_songId_fkey";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "songId",
ADD COLUMN     "spotifySongID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_spotifySongID_fkey" FOREIGN KEY ("spotifySongID") REFERENCES "Song"("spotifyTrackID") ON DELETE RESTRICT ON UPDATE CASCADE;
