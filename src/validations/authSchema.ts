import { z } from 'zod'

export const registerSchema = z.object({
  username: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: 'Invalid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain one punctuation mark',
    }),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: 'Invalid email address',
    }),
  password: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
