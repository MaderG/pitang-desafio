import { z } from 'zod'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants'

export const AppointmentSchema = z.object({
  name: z.string().min(1, 'Insira seu nome'),
  birthDate: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.string().default('PENDING'),
})

export const AppointmentQuerySchema = z.object({
  page: z.string().optional().default(DEFAULT_PAGE),
  limit: z.string().optional().default(DEFAULT_LIMIT),
  date: z
    .union([z.string(), z.null()])
    .optional()
    .transform((val) => val ?? undefined),
  status: z
    .union([z.string(), z.null()])
    .optional()
    .transform((val) => val ?? undefined),
  sortBy: z.string().optional().default('date'),
  order: z.string().optional().default('asc'),
})
