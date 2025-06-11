import prisma from "../config/prismaClient.js";
import { getSpotifySongData } from "../../services/spotifyServices.js";
import log from "../../logger.js";

export const songdbCheck = async (songID) => {
  try {
    const songExist = await prisma.song.findUnique({
      where: { spotifyTrackID: songID },
    });

    const found = !!songExist;
    log.info(`Checked song existence for ID: ${songID} 🔍 - Found: ${found}`);
    return found;
  } catch (error) {
    log.error("Failed to check song in DB 💥", error);
    return false;
  }
};

export const songdbCreate = async (songID) => {
  try {
    const exists = await songdbCheck(songID);
    if (exists) {
      log.warn(`Song already exists in DB 🎵 ID: ${songID}`);
      return null;
    }

    const songData = await getSpotifySongData(songID);
    log.info("Fetched song data from Spotify API 🎧", songData);

    const songAdd = await prisma.song.create({
      data: {
        spotifyTrackID: songID,
        title: songData.title,
      },
    });

    log.success(`Song added to DB 🎶 ID: ${songID}`, songAdd);
    return true;
  } catch (error) {
    log.error("Error while adding song to DB 🚫", error);
    return false;
  }
};
