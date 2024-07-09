import { MAX_DAILY_APPOINTMENTS } from '../constants';
import { InvalidDateError } from '../errors/InvalidDateError';
import { prisma } from '../lib/prisma';
import { format, startOfDay, endOfDay, parseISO, setHours, isBefore, addHours, isValid } from 'date-fns';
import { TimeCounts } from '../types/TimeCounts';

export class AvailableAppointmentService {
  async listAvailableDays() {
    const appointments = await prisma.appointment.findMany({
      select: { date: true },
    });

    const dates = appointments.map(appointment => format(startOfDay(new Date(appointment.date)), 'yyyy-MM-dd'));
    return [...new Set(dates)];
  }

  async listAvailableTimes(date: string) {
    if (!date || !isValid(parseISO(date))) {
      throw new InvalidDateError('Missing or invalid date query parameter');
    }

    const dayStart = startOfDay(parseISO(date));
    const dayEnd = endOfDay(parseISO(date));

    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: dayStart, lte: dayEnd } },
      select: { date: true },
    });

    const timeCounts: TimeCounts = {};
    appointments.forEach(appointment => {
      const time = format(appointment.date, 'HH:mm');
      timeCounts[time] = (timeCounts[time] || 0) + 1;
    });

    const availableTimes = [];
    let currentTime = setHours(dayStart, 8);
    const endTime = setHours(dayStart, 18);

    while (isBefore(currentTime, endTime)) {
      const formattedHour = format(currentTime, 'HH:mm');
      if (!timeCounts[formattedHour] || timeCounts[formattedHour] < 2) {
        availableTimes.push(formattedHour);
      }
      currentTime = addHours(currentTime, 1);
    }

    return availableTimes;
  }

  async listUnavailableDays() {
    const result = await prisma.appointment.groupBy({
      by: ['date'],
      _count: true,
    });

    const appointmentsPerDay =result.reduce((acc, result) => {
      const day = format(startOfDay(result.date), 'yyyy-MM-dd');
      acc[day] = (acc[day] || 0) + result._count;
      return acc;
    }, {} as TimeCounts);

    const unavailableDays = Object.entries(appointmentsPerDay)
      .filter(([, count]) => count >= MAX_DAILY_APPOINTMENTS)
      .map(([day]) => day);


    return unavailableDays;
  }
}

export const availableAppointmentService = new AvailableAppointmentService();
