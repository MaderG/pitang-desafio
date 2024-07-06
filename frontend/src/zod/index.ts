import { z } from "zod";

const VaccineAppointmentSchema = z.object({
  name: z.string().min(1, "Você precisa informar um nome"),
  birthDate: z.date({ message: "Informe uma data de nascimento" }),
  date: z.date({ message: "Informe uma data de vacinação" }),
  time: z.string({ message: "Informe um horário de vacinação" }),
});

export default VaccineAppointmentSchema;
