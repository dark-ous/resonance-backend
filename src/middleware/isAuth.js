import jwt from "jsonwebtoken";
const jwt_token = process.env.JWTTOKEN;

if (!jwt_token) throw new Error("Jwt Token Missing!");

export const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwt_token);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Jwt Verification Error", error);
    return res.status(401).json({ error: "Invalid or Expired Token" });
  }
};
