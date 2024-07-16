import { Request, Response } from 'express'
import { AppointmentSchema } from '../zod'
import { AppointmentQuerySchema } from '../zod'
import { constructDateTime } from '../utils/dateUtils'
import { AppointmentInput } from '../types/AppointmentInput'
import { createAppointmentService } from '../services/createAppointment.service'
import { listAppointmentService } from '../services/listAppointment.service'
import { updateAppointmentService } from '../services/updateAppointment.service'
import { availableAppointmentService } from '../services/availableAppointment.service'
import { handleErrorResponse } from '../utils/handleErrorResponse'

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
      return handleErrorResponse(err as Error, res);
    }
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const queryParams = AppointmentQuerySchema.parse(req.query)

      const { totalPages, appointments, allAppointments } = await listAppointmentService.listAppointments(queryParams);


      return res.status(200).json({ totalPages, appointments, allAppointments })
    } catch (err) {
      return handleErrorResponse(err as Error, res);
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
      return res.status(200).json(appointment)
    } catch (err) {
      return handleErrorResponse(err as Error, res);
    }
  }

  async listAvailableDays(req: Request, res: Response) {
    try {
      const uniqueDays = await availableAppointmentService.listAvailableDays()
      return res.json(uniqueDays)
    } catch (err) {
      return handleErrorResponse(err as Error, res);
    }
    }

  async listAvailableTimes(req: Request, res: Response) {
    try {
      const { date } = req.query
      const availableTimes =
        await availableAppointmentService.listAvailableTimes(date as string)
      return res.json(availableTimes)
    } catch (err) {
      return handleErrorResponse(err as Error, res);
    }
  }

  async listUnavailableDays(req: Request, res: Response) {
    try {
      const unavailableDays =
        await availableAppointmentService.listUnavailableDays()
      return res.json(unavailableDays)
    } catch (err) {
      return handleErrorResponse(err as Error, res);
  }
}
}
