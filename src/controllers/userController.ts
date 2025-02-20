import { Request, Response, NextFunction } from "express";
import {
  registerUserService,
  loginUserService,
  verifyTokenService,
} from "../services/userServices";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const result = await registerUserService(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header

  if (!token) {
    res.status(401).json({ isValid: false, message: "No token provided" });
    return;
  }

  try {
    const isValid = await verifyTokenService(token);
    res.status(200).json({ isValid });
  } catch (error) {
    res
      .status(500)
      .json({ isValid: false, message: "Token verification failed" });
  }
};
