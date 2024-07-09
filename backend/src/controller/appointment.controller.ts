import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import {AppointmentSchema} from '../zod'
import { AppointmentQuery } from '../types/AppointmentQuery'
import { constructDateTime } from '../utils/dateUtils'
import { BookingBoundsError } from '../errors/BookingBoundsError'
import { AppointmentInput } from '../types/AppointmentInput'
import { addHours, endOfDay, format, isBefore, isValid, parseISO, setHours, startOfDay } from 'date-fns'
import { PastDateError } from '../errors/PastDateError'
import { AlreadyBookedError } from '../errors/AlreadyBookedError'
import { createAppointmentService } from '../services/createAppointment.service'
import { listAppointmentService } from '../services/listAppointment.service'
import { InvalidDateError } from '../errors/InvalidDateError'
import { InvalidStatusError } from '../errors/InvalidStatusError'

export default class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const inputData: AppointmentInput = AppointmentSchema.parse(req.body);
      const dateObj = constructDateTime(inputData.date, inputData.time);
      
      const appointment = await createAppointmentService.createAppointment(inputData, dateObj);
      return res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof BookingBoundsError || err instanceof PastDateError || err instanceof AlreadyBookedError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '10',
        date,
        status,
        sortBy = 'date',
        order = 'asc'
    } = req.query as Partial<AppointmentQuery>;

    const query: AppointmentQuery = {
      page,
      limit,
      date,
      status,
      sortBy,
      order
  };

      const { totalPages, appointments } = await listAppointmentService.listAppointments(query);

      return res.status(200).json({ totalPages, appointments });
    } catch (err) {
      if (err instanceof InvalidDateError || err instanceof InvalidStatusError) {
        console.log(err.message)
        return res.status(400).json({ error: err.message });
      }
      console.error('Error retrieving appointments:', err);
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