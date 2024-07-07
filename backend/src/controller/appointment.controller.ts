import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import AppointmentSchema from '../zod'
import { AppointmentQuery } from '../types/AppointmentQuery'
import { appointmentValidationService } from '../services/appointmentValidation.service'
import { constructDateTime } from '../utils/dateUtils'
import { BookingBoundsError } from '../errors/BookingBoundsError'
import { AppointmentInput } from '../types/AppointmentInput'
import { mapStatusesToEnglish } from '../utils/statusUtils'
import { addHours, endOfDay, format, isBefore, isValid, parseISO, setHours, startOfDay } from 'date-fns'
import { PastDateError } from '../errors/PastDateError'
import { AlreadyBookedError } from '../errors/AlreadyBookedError'

export default class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const inputData: AppointmentInput = AppointmentSchema.parse(req.body);
      const dateObj = constructDateTime(inputData.date, inputData.time);
  
      await appointmentValidationService.validateAppointment(inputData, dateObj);
  
      const appointment = await prisma.appointment.create({
        data: {
          name: inputData.name,
          birthDate: parseISO(inputData.birthDate),
          date: dateObj,
        },
      });
      return res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof BookingBoundsError || err instanceof PastDateError || err instanceof AlreadyBookedError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async index(req: Request, res: Response) {
    const {
      page = '1',
      limit = '10',
      date,
      status,
      sortBy = 'date',
      order = 'asc',
    } = req.query as AppointmentQuery;

    const whereClause: { date?: { gte: Date; lte: Date }; status?: { in: string[] }; } = {};

    if (date && isValid(parseISO(date))) {
      const dayStart = startOfDay(parseISO(date));
      const dayEnd = endOfDay(parseISO(date));
      whereClause.date = {
        gte: dayStart,
        lte: dayEnd,
      };
    }

    
    // if there is not status, the query will return empty
    if (!status) {
      return res.json({ totalPages: 0, appointments: [], allAppointments: [] });
    }

    const statusesInEnglish = mapStatusesToEnglish(status.split(','));
    whereClause.status = { in: statusesInEnglish };
  
    try {
      const appointments = await prisma.appointment.findMany({
        where: whereClause,
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
        orderBy: {
          [sortBy === 'time' ? 'date' : sortBy]: order,
        },
      });

      const totalRecords = await prisma.appointment.count({
        where: whereClause,
      });

      const allAppointments = await prisma.appointment.findMany();

      const totalPages = Math.ceil(totalRecords / Number(limit));

      return res.json({ totalPages, appointments, allAppointments });
    } catch (error) {
      console.error('Error retrieving appointments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { status } = req.body

    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    })

    return res.json(appointment)
  }

  async listAvailableDays(req: Request, res: Response) {
    try {
      const appointments = await prisma.appointment.findMany({
        select: {
          date: true,
        },
      })
      
      const dates = appointments.map((appointment) =>
        format(startOfDay(new Date(appointment.date)), 'yyyy-MM-dd')
      );
      const uniqueDates = [...new Set(dates)]
      return res.json(uniqueDates)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message })
      }
    }
  }

  async listAvailableTimes(req: Request, res: Response) {
    try {
      const { date } = req.query;
      if (!date || !isValid(parseISO(date as string))) {
        return res.status(400).json({ error: 'Missing or invalid date query parameter' });
      }
  
      const dayStart = startOfDay(parseISO(date as string));
      const dayEnd = endOfDay(parseISO(date as string));
  
      const appointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        select: {
          date: true,
        },
      });
  
      const timeCounts: Record<string, number> = {};
      appointments.forEach(appointment => {
        const time = format(appointment.date, 'HH:mm');
        timeCounts[time] = (timeCounts[time] || 0) + 1;
      });
  
      const availableTimes: string[] = [];
      let currentTime = setHours(dayStart, 8);
      const endTime = setHours(dayStart, 18);
  
      while (isBefore(currentTime, endTime)) {
        const formattedHour = format(currentTime, 'HH:mm');
        if (!timeCounts[formattedHour] || timeCounts[formattedHour] < 2) {
          availableTimes.push(formattedHour);
        }
        currentTime = addHours(currentTime, 1);
      }
  
      return res.json(availableTimes);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
    }
  }
}