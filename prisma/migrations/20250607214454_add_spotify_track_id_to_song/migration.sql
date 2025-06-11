/*
  Warnings:

  - A unique constraint covering the columns `[spotifyTrackID]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotifyTrackID` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "spotifyTrackID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Song_spotifyTrackID_key" ON "Song"("spotifyTrackID");
