import { z } from "zod";
import VaccineAppointmentSchema from "../zod";

export type Appointment = z.infer<typeof VaccineAppointmentSchema> & { 
  id: number
  status: string 
  date: string
};
