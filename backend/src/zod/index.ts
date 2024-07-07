import { z } from 'zod'

const AppointmentSchema = z.object({
  name: z.string().min(1, 'Insira seu nome'),
  birthDate: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.string().default('PENDING'),
})

export default AppointmentSchema