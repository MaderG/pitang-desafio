import { endOfDay, startOfDay } from 'date-fns'
import { prisma } from '../lib/prisma'
import { mapStatusesToEnglish } from '../utils/statusUtils'
import { AppointmentQuery } from '../types/AppointmentQuery'
import { Appointment } from '@prisma/client'
import { InvalidDateError } from '../errors/InvalidDateError'
import { VALID_SORT_BY, VALID_STATUSES } from '../utils/constants'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { InvalidSortByError } from '../errors/InvalidSortByError'
import { InvalidParamsError } from '../errors/InvaliParamsError'

export class ListAppointmentService {
  async listAppointments(
    query: AppointmentQuery,
  ): Promise<{ totalPages: number; appointments: Appointment[] }> {
    const { page, limit, date, status, sortBy, order } = query


    const parsedPage = this.processPageFilter(page)
    const parsedLimit = this.processLimitFilter(limit)

    const whereClause: {
      date?: { gte: Date; lte: Date }
      status?: { in: string[] }
    } = {}

    const dateFilter = this.processDateFilter(date)
    if (dateFilter) {
      whereClause.date = dateFilter
    }

    const sortFilter = this.processSortFilter(sortBy)
    if (!sortFilter) {
      throw new InvalidSortByError('Parâmetro de ordenação inválido')
    }

    const statusFilter = this.processStatusFilter(status)

    if (!statusFilter) {
      return { totalPages: 0, appointments: [] }
    }
    whereClause.status = { in: statusFilter }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      take: parsedLimit,
      skip: (parsedPage - 1) * parsedLimit,
      orderBy: {
        [sortBy === 'time' ? 'date' : sortBy]: order,
      },
    })

    const totalRecords = await prisma.appointment.count({
      where: whereClause,
    })

    const totalPages = Math.ceil(totalRecords / Number(limit))

    return { totalPages, appointments }
  }

  private processPageFilter(page: string): number {
    const parsedPage = Number(page)
    if (isNaN(parsedPage) || parsedPage < 1) {
      throw new InvalidParamsError('Página inválida')
    }
    return parsedPage
  }

  private processLimitFilter(limit: string): number {
    const parsedLimit = Number(limit)
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      throw new InvalidParamsError('Limite inválido')
    }
    return parsedLimit
  }

  private processDateFilter(
    date?: string,
  ): { gte: Date; lte: Date } | undefined {
    if (date && date !== 'null') {
      const dateObj = new Date(date)
      if (!isNaN(dateObj.getTime())) {
        const dayStart = startOfDay(dateObj)
        const dayEnd = endOfDay(dateObj)
        return {
          gte: dayStart,
          lte: dayEnd,
        }
      } else {
        throw new InvalidDateError('Formato de data inválido')
      }
    }
  }

  private processSortFilter(sortBy: string): string {
    if (!VALID_SORT_BY.includes(sortBy)) {
      throw new InvalidSortByError('Parâmetro de ordenação inválido')
    }
    if (sortBy === 'time') {
      return 'date'
    }
    return sortBy
  }

  private processStatusFilter(status?: string): string[] | undefined {
    if (!status) {
      return undefined
    }

    const translatedStatuses = mapStatusesToEnglish(status.split(','))
    const isValid = translatedStatuses.every((status) =>
      VALID_STATUSES.includes(status),
    )

    if (!isValid) {
      throw new InvalidStatusError('Status inexistente')
    }

    return translatedStatuses
  }
}

export const listAppointmentService = new ListAppointmentService()
