import axios from "axios";

// Cache for token and expiry
let cachedToken = null;
let tokenExpiry = null;

// Get Spotify token and cache it
export const getSpotifyToken = async () => {
  const now = Date.now();

  // If token exists and not expired, return cached token
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;

  const authString = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Cache token and expiry
    cachedToken = res.data.access_token;
    tokenExpiry = now + res.data.expires_in * 1000; // expires_in is in seconds

    return cachedToken;
  } catch (error) {
    console.error("Error fetching Spotify token:", error.message);
    throw new Error("Spotify authentication failed");
  }
};

// Get song data from Spotify
export const getSpotifySongData = async (songID) => {
  try {
    const token = await getSpotifyToken();

    const res = await axios.get(`https://api.spotify.com/v1/tracks/${songID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;

    return {
      title: data.name,
      artist: data.artists.map((a) => a.name).join(", "),
      album: data.album.name,
      image: data.album.images?.[0]?.url || null,
      
    };
  } catch (error) {
    console.error(
      `Error fetching song ${songID}:`,
      error.response?.data || error.message
    );
    return null; // Fallback value if song not found or network error
  }
};

export const getSpotifySongsBySearch = async (req, res) => {
  const { query } = req.params;
  try {
    if (!query) return [];

    const token = await getSpotifyToken();
    const songList = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=8`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!songList.ok) {
      const errorMessage = await songList.text();
      throw new Error(errorMessage || "Failed to fetch tracks");
    }

    const data = await songList.json();
    const simplifiedTracks = data.tracks.items.map((track) => ({
      id:track.id,
      duration_ms:track.duration_ms,
      popularity:track.popularity,
      name: track.name,
      artist: track.artists[0].name,
      image: track.album.images[0]?.url || null,
      url:track.external_urls.spotify,
    }));

    return res.status(200).json({ tracks: simplifiedTracks });

  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: error });
  }
};
