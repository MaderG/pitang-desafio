import { Response } from 'express'
import { BookingBoundsError } from '../errors/BookingBoundsError'
import { PastDateError } from '../errors/PastDateError'
import { AlreadyBookedError } from '../errors/AlreadyBookedError'
import { InvalidDateError } from '../errors/InvalidDateError'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { AppointmentNotExistsError } from '../errors/AppointmentNotExistsError'
import { InvalidSortByError } from '../errors/InvalidSortByError'
import { MissingParametersError } from '../errors/MissingParametersError'
import { UnableToUpdateError } from '../errors/UnableToUpdateError'

export function handleErrorResponse(err: Error, res: Response): Response {
  if (
    err instanceof BookingBoundsError ||
    err instanceof PastDateError ||
    err instanceof AlreadyBookedError ||
    err instanceof InvalidDateError ||
    err instanceof InvalidStatusError ||
    err instanceof InvalidSortByError ||
    err instanceof MissingParametersError ||
    err instanceof UnableToUpdateError
  ) {
    return res.status(400).json({ error: err.message })
  }
  if (err instanceof AppointmentNotExistsError) {
    return res.status(404).json({ error: err.message })
  }

  console.error('Server Error:', err)
  return res.status(500).json({ error: 'Internal Server Error' })
}
