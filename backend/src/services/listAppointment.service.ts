import { endOfDay, startOfDay } from 'date-fns'
import { prisma } from '../lib/prisma'
import { mapStatusesToEnglish } from '../utils/statusUtils'
import { AppointmentQuery } from '../types/AppointmentQuery'
import { Appointment } from '@prisma/client'
import { InvalidDateError } from '../errors/InvalidDateError'
import { VALID_SORT_BY, VALID_STATUSES } from '../utils/constants'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { InvalidSortByError } from '../errors/InvalidSortByError'
import { InvalidParamsError } from '../errors/InvalidParamsError'

export class ListAppointmentService {
  async listAppointments(
    query: AppointmentQuery,
  ): Promise<{ totalPages: number; appointments: Appointment[], allAppointments: number }> {
    try {
      const { page, limit, date, status, sortBy, order } = query

      const parsedOrder = order === 'asc' ? 'asc' : 'desc'
      const parsedPage = this.processPageFilter(page)
      const parsedLimit = this.processLimitFilter(limit)

      const allAppointments = await prisma.appointment.count()

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
        return { totalPages: 0, appointments: [], allAppointments }
      }
      whereClause.status = { in: statusFilter }

      const appointments = await prisma.appointment.findMany({
        where: whereClause,
        take: parsedLimit,
        skip: (parsedPage - 1) * parsedLimit,
        orderBy: {
          [sortBy === 'time' ? 'date' : sortBy]: parsedOrder,
        },
      })

      const totalRecords = await prisma.appointment.count({
        where: whereClause,
      })

      const totalPages = Math.ceil(totalRecords / Number(limit))

      if (parsedPage > totalPages && totalPages !== 0) {
        throw new InvalidParamsError('Página maior que o total de páginas')
      }

      return { totalPages, appointments, allAppointments }
    } catch (error) {
      
      if (error instanceof InvalidDateError || 
          error instanceof InvalidStatusError || 
          error instanceof InvalidSortByError || 
          error instanceof InvalidParamsError) {
        throw error
      }
      throw new Error('Ocorreu um erro ao listar os agendamentos')
    }
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
