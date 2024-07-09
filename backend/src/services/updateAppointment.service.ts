import { Appointment } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { VALID_STATUSES } from '../constants'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { mapStatusToEnglish } from '../utils/statusUtils'
import { AppointmentNotExistsError } from '../errors/AppointmentNotExistsError'

export class UpdateAppointmentService {
  async updateAppointment(id: string, status: string): Promise<Appointment> {
    const newStatus = await this.validateStatus(status)
    try {
      const appointment = await prisma.appointment.update({
        where: {
          id: Number(id),
        },
        data: {
          status: newStatus,
        },
      })

      return appointment
    } catch (error) {
      throw new AppointmentNotExistsError('Agendamento não encontrado')
    }
  }

  private async validateStatus(status: string): Promise<string> {
    if (!status) {
      throw new InvalidStatusError('É necessário informar o status')
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
