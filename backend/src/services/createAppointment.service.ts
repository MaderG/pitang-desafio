import { prisma } from '../lib/prisma'
import { AppointmentInput } from '../types/AppointmentInput'
import { BookingBoundsError } from '../errors/BookingBoundsError'
import {
  isBefore,
  startOfDay,
  endOfDay,
  startOfHour,
  endOfHour,
  parseISO,
} from 'date-fns'
import { AlreadyBookedError } from '../errors/AlreadyBookedError'
import { PastDateError } from '../errors/PastDateError'
import { Appointment } from '@prisma/client'
import { MAX_DAILY_APPOINTMENTS, MAX_HOURLY_APPOINTMENTS } from '../constants'

export class CreateAppointmentService {
  async createAppointment(
    inputData: AppointmentInput,
    dateObj: Date,
  ): Promise<Appointment> {
    await createAppointmentService.validateAppointment(inputData, dateObj)
    const appointment = await prisma.appointment.create({
      data: {
        name: inputData.name,
        birthDate: parseISO(inputData.birthDate),
        date: dateObj,
      },
    })
    return appointment
  }

  private async validateAppointment(
    inputData: AppointmentInput,
    dateObj: Date,
  ): Promise<void> {
    this.checkPastDate(dateObj)
    await this.validateExistingAppointment(inputData, dateObj)
    await this.validateDailyLimit(dateObj)
    await this.validateHourlyLimit(dateObj)

  }

  private checkPastDate(dateObj: Date): void {
    if (isBefore(dateObj, new Date())) {
      throw new PastDateError('Você não pode criar um agendamento no passado')
    }
  }
  private async validateDailyLimit(dateObj: Date): Promise<void> {
    const start = startOfDay(dateObj)
    const end = endOfDay(dateObj)

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    
    if (appointments.length >= MAX_DAILY_APPOINTMENTS) {
      throw new BookingBoundsError('Limite de agendamentos excedido para o dia')
    }
  }

  private async validateHourlyLimit(dateObj: Date): Promise<void> {
    const start = startOfHour(dateObj)
    const end = endOfHour(dateObj)
    const appointmentsInHour = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    if (appointmentsInHour.length >= MAX_HOURLY_APPOINTMENTS) {
      throw new BookingBoundsError('Limite de agendamentos por hora excedido')
    }
  }

  private async validateExistingAppointment(
    inputData: AppointmentInput,
    dateObj: Date,
  ): Promise<void> {
    const birthDate = startOfDay(new Date(inputData.birthDate))
    const userAppointment = await prisma.appointment.findFirst({
      where: {
        name: inputData.name,
        birthDate: birthDate,
        date: dateObj,
      },
    })

    if (userAppointment) {
      throw new AlreadyBookedError('Você já possui um agendamento')
    }
  }
}

export const createAppointmentService = new CreateAppointmentService()
