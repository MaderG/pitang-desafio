import { Appointment } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { VALID_STATUSES } from '../constants'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { mapStatusToEnglish } from '../utils/statusUtils'
import { AppointmentNotExistsError } from '../errors/AppointmentNotExistsError'

export class UpdateAppointmentService {
  async updateAppointment(id: string, status: string): Promise<Appointment> {
    console.log('entrei')
    const newStatus = await this.validateStatus(status)
    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id),
      },
      data: {
        status: newStatus,
      },
    })

    if (!appointment) {
      throw new AppointmentNotExistsError('Agendamento não encontrado')
    }

    return appointment
  }

  private async validateStatus(status: string): Promise<string> {
    if (!status) {
      throw new InvalidStatusError('Status is required')
    }
    const translatedStatus = mapStatusToEnglish(status)
    const isValidStatus = VALID_STATUSES.includes(translatedStatus)
    if (!isValidStatus) {
      throw new InvalidStatusError('Status inexistente')
    }
    return translatedStatus
  }
}

export const updateAppointmentService = new UpdateAppointmentService()
