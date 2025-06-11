import prisma from "../config/prismaClient.js";
import { songdbCheck, songdbCreate } from "./songdbController.js";
import log from "../../logger.js";

export const createThread = async (req, res) => {
  const userID = req.user.id;
  const { username, content, timestamp, songID } = req.body;
  const parentID = req.params.threadID;

  if (!username || !content || !timestamp || !songID) {
    log.warn("Missing required fields in request body");
    return res.status(400).json({ error: "One or more fields are empty" });
  }

  if (!parentID) {
    const checkSongdb = await songdbCheck(songID);
    if (!checkSongdb) {
      const songCreated = await songdbCreate(songID);
      if (!songCreated) {
        log.error("Failed to add song to database");
        return res.status(500).json({ error: "Failed to add song to database" });
      }
    }
  }

  try {
    const thread = await prisma.thread.create({
      data: {
        username,
        content,
        timestamp,
        author: { connect: { id: userID } },
        song: { connect: { spotifyTrackID: songID } },
        ...(parentID && {
          parent: { connect: { id: parentID } },
        }),
      },
    });

    log.success("Thread/Reply post successful 🎉", thread);
    return res.status(201).json({ message: "Thread/Reply created", thread });
  } catch (err) {
    log.error("Thread post error 💥", err);
    return res.status(500).json({ error: "Something went wrong while creating thread/reply" });
  }
};

export const showThreads = async (req, res) => {
  const { songID } = req.params;
  try {
    const songThreads = await prisma.song.findMany({
      where: { spotifyTrackID: songID },
      include: { threads: true },
    });

    return res.status(200).json({ threads: songThreads[0]?.threads || [] });
  } catch (error) {
    log.error("Error while fetching the threads 🔍", error);
    res.status(500).json({ error: "Error while fetching the threads" });
  }
};

export const getReplies = async (req, res) => {
  const { threadID } = req.params;
  try {
    const replies = await prisma.thread.findMany({
      where: { parentId: threadID },
    });
    log.info(`Fetched replies for thread 💬 ${threadID}`);
    return res.status(200).json({ replies });
  } catch (error) {
    log.error(`Error while fetching replies for thread "${threadID}" ❗`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
