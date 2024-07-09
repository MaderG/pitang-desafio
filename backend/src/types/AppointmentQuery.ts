import { z } from "zod";
import { AppointmentQuerySchema } from "../zod";

export type AppointmentQuery = z.infer<typeof AppointmentQuerySchema>