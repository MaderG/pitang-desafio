import {AppointmentSchema} from '../zod'
import { z } from 'zod'

export type AppointmentInput = z.infer<typeof AppointmentSchema>
