import { Response } from 'express'
import { ZodError } from 'zod'

import { AlreadyBookedError } from '../errors/AlreadyBookedError'
import { AppointmentNotExistsError } from '../errors/AppointmentNotExistsError'
import { BookingBoundsError } from '../errors/BookingBoundsError'
import { InvalidDateError } from '../errors/InvalidDateError'
import { InvalidParamsError } from '../errors/InvalidParamsError'
import { InvalidSortByError } from '../errors/InvalidSortByError'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { MissingParametersError } from '../errors/MissingParametersError'
import { PastDateError } from '../errors/PastDateError'
import { UnableToUpdateError } from '../errors/UnableToUpdateError'
import { InvalidHourError } from '../errors/InvalidHourError'

export function handleErrorResponse(err: Error, res: Response): Response {
  if (
    err instanceof AlreadyBookedError ||
    err instanceof BookingBoundsError ||
    err instanceof InvalidDateError ||
    err instanceof InvalidParamsError ||
    err instanceof InvalidSortByError ||
    err instanceof InvalidStatusError ||
    err instanceof MissingParametersError ||
    err instanceof PastDateError ||
    err instanceof UnableToUpdateError ||
    err instanceof InvalidHourError
  ) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof AppointmentNotExistsError) {
    return res.status(404).json({ error: err.message })
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.errors[0].message })
  }
  return res.status(500).json({ error: 'Internal Server Error' })
}
