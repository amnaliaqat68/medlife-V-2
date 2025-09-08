import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return null;
  }
}