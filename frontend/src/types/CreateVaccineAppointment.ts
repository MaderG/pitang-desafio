import { z } from "zod";
import VaccineAppointmentSchema from "../zod";

export type CreateVaccineAppointment = z.infer<typeof VaccineAppointmentSchema>;