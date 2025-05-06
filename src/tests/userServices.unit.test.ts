import {
  loginUserService,
  registerUserService,
  verifyTokenService,
} from '../services/userServices'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import { generateToken, verifyToken } from '../config/jwt'

jest.mock('../models/User')
jest.mock('bcryptjs')
jest.mock('../config/jwt')

describe('User Services', () => {
  const mockUser = {
    _id: 'mocked-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    save: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('registerUserService', () => {
    it('should register a user successfully', async () => {
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword')
      ;(User as any).mockImplementation(() => mockUser)

      const result = await registerUserService(
        'user',
        'test@example.com',
        '123456'
      )

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10)
      expect(mockUser.save).toHaveBeenCalled()
      expect(result).toEqual({ message: 'User created' })
    })
  })

  describe('loginUserService', () => {
    it('should return a token if credentials are correct', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(generateToken as jest.Mock).mockReturnValue('fakeToken')

      const result = await loginUserService('test@example.com', '123456')

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
      expect(result).toEqual({ token: 'fakeToken' })
    })

    it('should return an error if the user does not exist', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(null)

      await expect(
        loginUserService('wrong@example.com', '123456')
      ).rejects.toThrow('Wrong credentials.')
    })

    it('should return an error if the password does not match', async () => {
      ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        loginUserService('test@example.com', 'wrongpass')
      ).rejects.toThrow('Wrong credentials.')
    })
  })

  describe('verifyTokenService', () => {
    it('should return true if the token is valid', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue({ userId: '123' })

      const result = await verifyTokenService('valid.token.here')

      expect(result).toBe(true)
    })

    it('should return false if the token is invalid', async () => {
      ;(verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = await verifyTokenService('invalid.token')

      expect(result).toBe(false)
    })
  })
})
