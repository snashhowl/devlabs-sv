import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../config/jwt'

interface IGetUserAuthInfoRequest extends Request {
  user?: { id: string }
}

const auth = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Access denied' })
    return
  }

  try {
    const decoded = verifyToken(token)
    req.user = { id: decoded.userId }
    next()
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' })
  }
}

export default auth
