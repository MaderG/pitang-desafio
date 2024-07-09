import { AvailableAppointmentService } from '../src/services/availableAppointment.service'
import { prisma } from '../src/lib/prisma'
import { InvalidDateError } from '../src/errors/InvalidDateError'
import { MAX_DAILY_APPOINTMENTS } from '../src/utils/constants'
import { startOfDay, parseISO, endOfDay } from 'date-fns'

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    appointment: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}))

describe('AvailableAppointmentService', () => {
  const service = new AvailableAppointmentService()

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('listAvailableDays', () => {
    it('should return a list of unique available days', async () => {
      const mockAppointments = [
        { date: new Date('2023-01-01T10:00:00.000Z') },
        { date: new Date('2023-01-01T11:00:00.000Z') },
        { date: new Date('2023-01-02T10:00:00.000Z') },
      ]

      ;(prisma.appointment.findMany as jest.Mock).mockResolvedValue(
        mockAppointments,
      )

      const result = await service.listAvailableDays()

      expect(result).toEqual(['2023-01-01', '2023-01-02'])
      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        select: { date: true },
      })
    })
  })

  describe('listAvailableTimes', () => {
    it('should throw an error if date is missing or invalid', async () => {
      await expect(service.listAvailableTimes('invalid-date')).rejects.toThrow(
        InvalidDateError,
      )
    })

    it('should return a list of available times for a given date', async () => {
      const mockDate = '2023-01-01'
      const mockAppointments = [
        { date: new Date('2023-01-01T13:00:00.000Z') }, // GMT -03:00
        { date: new Date('2023-01-01T13:00:00.000Z') },
        { date: new Date('2023-01-01T14:00:00.000Z') },
        { date: new Date('2023-01-01T14:00:00.000Z') },
      ]

      ;(prisma.appointment.findMany as jest.Mock).mockResolvedValue(
        mockAppointments,
      )

      const result = await service.listAvailableTimes(mockDate)

      const expectedTimes = [
        '08:00',
        '09:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
      ]

      expect(result).toEqual(expectedTimes)
      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: startOfDay(parseISO(mockDate)),
            lte: endOfDay(parseISO(mockDate)),
          },
        },
        select: { date: true },
      })
    })
  })

  describe('listUnavailableDays', () => {
    it('should return a list of days that have reached the maximum number of appointments', async () => {
      const mockGroupedAppointments = [
        {
          date: new Date('2023-01-01T03:00:00.000Z'),
          _count: MAX_DAILY_APPOINTMENTS,
        }, // GMT -03:00
        { date: new Date('2023-01-02T03:00:00.000Z'), _count: 1 },
      ]

      ;(prisma.appointment.groupBy as jest.Mock).mockResolvedValue(
        mockGroupedAppointments,
      )

      const result = await service.listUnavailableDays()

      expect(result).toEqual(['2023-01-01'])
      expect(prisma.appointment.groupBy).toHaveBeenCalledWith({
        by: ['date'],
        _count: true,
      })
    })
  })
})
