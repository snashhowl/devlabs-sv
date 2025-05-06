import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      issues: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  if (err instanceof Error) {
    res.status(400).json({ message: err.message })
    return
  }

  res.status(500).json({ message: 'Internal Server Error' })
}
