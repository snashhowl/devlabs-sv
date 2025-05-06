import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
})

export const updateTaskSchema = z.object({
  completed: z.boolean(),
})

export const subtaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
})
