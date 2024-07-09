import { Request, Response } from 'express'
import { AppointmentSchema } from '../zod'
import { AppointmentQuery } from '../types/AppointmentQuery'
import { constructDateTime } from '../utils/dateUtils'
import { BookingBoundsError } from '../errors/BookingBoundsError'
import { AppointmentInput } from '../types/AppointmentInput'
import { PastDateError } from '../errors/PastDateError'
import { AlreadyBookedError } from '../errors/AlreadyBookedError'
import { createAppointmentService } from '../services/createAppointment.service'
import { listAppointmentService } from '../services/listAppointment.service'
import { InvalidDateError } from '../errors/InvalidDateError'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { updateAppointmentService } from '../services/updateAppointment.service'
import { AppointmentNotExistsError } from '../errors/AppointmentNotExistsError'
import { availableAppointmentService } from '../services/availableAppointment.service'

export default class AppointmentController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const inputData: AppointmentInput = AppointmentSchema.parse(req.body)
      const dateObj = constructDateTime(inputData.date, inputData.time)

      const appointment = await createAppointmentService.createAppointment(
        inputData,
        dateObj,
      )
      return res.status(201).json(appointment)
    } catch (err) {
      if (
        err instanceof BookingBoundsError ||
        err instanceof PastDateError ||
        err instanceof AlreadyBookedError
      ) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal Server Error' })
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
        order = 'asc',
      } = req.query as Partial<AppointmentQuery>

      const query: AppointmentQuery = {
        page,
        limit,
        date,
        status,
        sortBy,
        order,
      }

      const { totalPages, appointments } =
        await listAppointmentService.listAppointments(query)

      return res.status(200).json({ totalPages, appointments })
    } catch (err) {
      if (
        err instanceof InvalidDateError ||
        err instanceof InvalidStatusError
      ) {
        console.log(err.message)
        return res.status(400).json({ error: err.message })
      }
      console.error('Error retrieving appointments:', err)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body

      const appointment = await updateAppointmentService.updateAppointment(
        id,
        status,
      )
      return res.json(appointment)
    } catch (err) {
      if (
        err instanceof InvalidStatusError ||
        err instanceof AppointmentNotExistsError
      ) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async listAvailableDays(req: Request, res: Response) {
    try {
      const uniqueDays = await availableAppointmentService.listAvailableDays()
      return res.json(uniqueDays)
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
    }

  async listAvailableTimes(req: Request, res: Response) {
    try {
      const { date } = req.query
      const availableTimes =
        await availableAppointmentService.listAvailableTimes(date as string)
      return res.json(availableTimes)
    } catch (err) {
      if (err instanceof InvalidDateError) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async listUnavailableDays(req: Request, res: Response) {
    try {
      const unavailableDays =
        await availableAppointmentService.listUnavailableDays()
      return res.json(unavailableDays)
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' })
  }
}
}
