import { CreateAppointmentService } from '../src/services/createAppointment.service'
import { prisma } from '../src/lib/prisma'
import { AppointmentInput } from '../src/types/AppointmentInput'
import { BookingBoundsError } from '../src/errors/BookingBoundsError'
import { AlreadyBookedError } from '../src/errors/AlreadyBookedError'
import { PastDateError } from '../src/errors/PastDateError'
import { Appointment } from '@prisma/client'
import {
  MAX_DAILY_APPOINTMENTS,
  MAX_HOURLY_APPOINTMENTS,
} from '../src/utils/constants'
import { endOfHour, parseISO, startOfHour } from 'date-fns'
import { InvalidHourError } from '../src/errors/InvalidHourError'

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}))

const mockAppointment: Appointment = {
  id: 1,
  name: 'John Doe',
  birthDate: new Date('1990-01-01'),
  date: new Date('2025-01-01T11:00:00.000Z'),
  status: '',
}

describe('CreateAppointmentService', () => {
  const service = new CreateAppointmentService()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create an appointment successfully', async () => {
    const inputData: AppointmentInput = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      date: '2023-01-01',
      time: '11:00',
      status: 'PENDING',
    }
    const dateObj = new Date('2025-01-01T11:00:00.000Z')

    ;(prisma.appointment.create as jest.Mock).mockResolvedValue(mockAppointment)
    ;(prisma.appointment.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.appointment.findFirst as jest.Mock).mockResolvedValue(null)

    const result = await service.createAppointment(inputData, dateObj)

    expect(result).toEqual(mockAppointment)
    expect(prisma.appointment.create).toHaveBeenCalledWith({
      data: {
        name: inputData.name,
        birthDate: parseISO(inputData.birthDate),
        date: dateObj,
      },
    })
  })

  it('should throw PastDateError if date is in the past', async () => {
    const inputData: AppointmentInput = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      date: '2022-01-01',
      time: '11:00',
      status: 'PENDING',
    }
    const dateObj = new Date('2022-01-01T11:00:00.000Z')

    await expect(service.createAppointment(inputData, dateObj)).rejects.toThrow(
      PastDateError,
    )
  })

  it('should throw InvalidHourError if hour is outside of bounds', async () => {
    const inputData: AppointmentInput = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      date: '2025-01-01',
      time: '21:00',
      status: 'PENDING',
    }
    const dateObj = new Date('2025-01-01T21:00:00.000Z')

    await expect(service.createAppointment(inputData, dateObj)).rejects.toThrow(
      InvalidHourError,
    )
  })

  it('should throw BookingBoundsError if daily limit is exceeded', async () => {
    const inputData: AppointmentInput = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      date: '2025-01-01',
      time: '11:00',
      status: 'PENDING',
    }
    const dateObj = new Date('2025-01-01T11:00:00.000Z')

    ;(prisma.appointment.findMany as jest.Mock).mockResolvedValue(
      new Array(MAX_DAILY_APPOINTMENTS),
    )

    await expect(service.createAppointment(inputData, dateObj)).rejects.toThrow(
      BookingBoundsError,
    )
  })

  it('should throw BookingBoundsError if hourly limit is exceeded', async () => {
    const inputData: AppointmentInput = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      date: '2025-01-01',
      time: '11:00',
      status: 'PENDING',
    }
    const dateObj = new Date('2025-01-01T11:00:00.000Z')

    ;(prisma.appointment.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        const startHour = startOfHour(dateObj).getTime()
        const endHour = endOfHour(dateObj).getTime()

        if (
          where.date.gte.getTime() === startHour &&
          where.date.lte.getTime() === endHour
        ) {
          return new Array(MAX_HOURLY_APPOINTMENTS)
        }
        return []
      },
    )

    await expect(service.createAppointment(inputData, dateObj)).rejects.toThrow(
      BookingBoundsError,
    )
  })

  it('should throw AlreadyBookedError if appointment already exists', async () => {
    const inputData: AppointmentInput = {
      name: 'John Doe',
      birthDate: '1990-01-01',
      date: '2025-01-01',
      time: '11:00',
      status: 'PENDING',
    }
    const dateObj = new Date('2025-01-01T11:00:00.000Z')

    ;(prisma.appointment.findFirst as jest.Mock).mockResolvedValue(
      mockAppointment,
    )

    await expect(service.createAppointment(inputData, dateObj)).rejects.toThrow(
      AlreadyBookedError,
    )
  })
})
