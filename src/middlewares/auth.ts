import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface IGetUserAuthInfoRequest extends Request {
  user?: { id: string };
}

const auth = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.user = { id: decoded.id }; // 🔹 `user` siempre se define
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default auth;
