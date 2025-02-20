import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./envs";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "1h" });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET!);
};
