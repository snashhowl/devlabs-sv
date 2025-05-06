import { Request, Response, NextFunction } from 'express'
import {
  registerUserService,
  loginUserService,
  verifyTokenService,
} from '../services/userServices'
import { registerSchema, loginSchema } from '../validations/authSchema'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = registerSchema.parse(req.body)
    const { username, email, password } = parsed
    const result = await registerUserService(username, email, password)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = loginSchema.parse(req.body)
    const { email, password } = parsed
    const result = await loginUserService(email, password)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ isValid: false, message: 'No token provided' })
    return
  }

  try {
    const isValid = await verifyTokenService(token)
    res.status(200).json({ isValid })
  } catch (error) {
    res
      .status(500)
      .json({ isValid: false, message: 'Token verification failed' })
  }
}
