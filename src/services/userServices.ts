import User from '../models/User'
import bcrypt from 'bcryptjs'
import { generateToken, verifyToken } from '../config/jwt'
import mongoose from 'mongoose'

export const registerUserService = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, email, password: hashedPassword })
  await newUser.save()
  return { message: 'User created' }
}

export const loginUserService = async (email: string, password: any) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Wrong credentials.')
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Wrong credentials.')
  }

  const token = generateToken(user._id as string)
  return { token }
}

export const verifyTokenService = async (token: string): Promise<boolean> => {
  try {
    const decoded = verifyToken(token)
    return !!decoded.userId
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}
