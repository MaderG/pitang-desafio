import { prisma } from "@/lib/prisma";

export type AppointmentQuery = {
  page: string;        
  limit: string;       
  date?: string;
  time?: string;       
  status?: string;     
  sortBy: keyof typeof prisma.appointment; 
  order: 'asc' | 'desc';
}