import {
  DATE_FORMAT,
  MAX_DAILY_APPOINTMENTS,
  TIME_FORMAT,
} from '../utils/constants'
import { InvalidDateError } from '../errors/InvalidDateError'
import { prisma } from '../lib/prisma'
import {
  format,
  startOfDay,
  endOfDay,
  parseISO,
  setHours,
  isBefore,
  addHours,
  isValid,
} from 'date-fns'
import { TimeCounts } from '../types/TimeCounts'

export class AvailableAppointmentService {
  async listAvailableDays() {
    try {
      const appointments = await prisma.appointment.findMany({
        select: { date: true },
      })

      const dates = appointments.map((appointment) =>
        format(startOfDay(new Date(appointment.date)), DATE_FORMAT),
      )
      return [...new Set(dates)]
    } catch (error) {
      throw new Error('Ocorreu um erro ao listar os dias disponíveis')
    }
  }

  async listAvailableTimes(date: string) {
    try {
      if (!date || !isValid(parseISO(date))) {
        throw new InvalidDateError('Data inválida')
      }

      const dayStart = startOfDay(parseISO(date))
      const dayEnd = endOfDay(parseISO(date))

      const appointments = await prisma.appointment.findMany({
        where: { date: { gte: dayStart, lte: dayEnd } },
        select: { date: true },
      })

      const timeCounts: TimeCounts = {}
      appointments.forEach((appointment) => {
        const time = format(appointment.date, TIME_FORMAT)
        timeCounts[time] = (timeCounts[time] || 0) + 1
      })

      const availableTimes = []
      let currentTime = setHours(dayStart, 8)
      const endTime = setHours(dayStart, 18)

      while (isBefore(currentTime, endTime)) {
        const formattedHour = format(currentTime, TIME_FORMAT)
        if (!timeCounts[formattedHour] || timeCounts[formattedHour] < 2) {
          availableTimes.push(formattedHour)
        }
        currentTime = addHours(currentTime, 1)
      }

      return availableTimes
    } catch (error) {
      if (error instanceof InvalidDateError) {
        throw error
      }

      throw new Error('Ocorreu um erro ao listar os horários disponíveis')
    }
  }

  async listUnavailableDays() {
    try {
      const result = await prisma.appointment.groupBy({
        by: ['date'],
        _count: true,
      })

      const appointmentsPerDay = result.reduce((acc, result) => {
        const day = format(startOfDay(result.date), DATE_FORMAT)
        acc[day] = (acc[day] || 0) + result._count
        return acc
      }, {} as TimeCounts)

      const unavailableDays = Object.entries(appointmentsPerDay)
        .filter(([, count]) => count >= MAX_DAILY_APPOINTMENTS)
        .map(([day]) => day)

      return unavailableDays
    } catch (error) {

      throw new Error('Ocorreu um erro ao listar os dias indisponíveis')
    }
  }
}

export const availableAppointmentService = new AvailableAppointmentService()
