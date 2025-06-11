import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import log from "../../logger.js";

const jwt_token = process.env.JWTTOKEN;

export const register = async (req, res) => {
  const { email, password, username, name } = req.body;

  if (!email || !password || !username) {
    log.warn("Missing fields in registration request 🛑", req.body);
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      log.warn(`Email already exists 📧 ${email}`);
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username, name },
    });

    const token = jwt.sign({ id: user.id }, jwt_token, {
      expiresIn: "7d",
    });

    log.success("User registered successfully 📝", {
      id: user.id,
      username,
      email,
    });

    res.status(201).json({
      message: "User Registered",
      userID: user.id,
      username: username,
      token: token,
    });
  } catch (error) {
    log.error("Registration failed 💥", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    log.warn("Login failed: Missing credentials 🔐", req.body);
    return res.status(400).json({ error: "Credentials Missing" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      log.warn(`Login failed: User not found ❌ username: ${username} ,${password}`);
      return res.status(404).json({ error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      log.warn(`Login failed: Password mismatch ❗ username: ${username}`);
      return res.status(400).json({ error: "Credentials did not match" });
    }

    const token = jwt.sign({ id: user.id }, jwt_token, {
      expiresIn: "7d",
    });

    log.success(`User logged in ✅ username: ${username}`);
    res.json({ token: token, username: user.username });
  } catch (error) {
    log.error("Login error 💥", error);
    res.status(400).json({ error: "Something went wrong!" });
  }
};
