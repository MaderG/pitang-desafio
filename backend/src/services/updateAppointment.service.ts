import { Appointment } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { VALID_STATUSES } from '../constants'
import { InvalidStatusError } from '../errors/InvalidStatusError'
import { mapStatusToEnglish } from '../utils/statusUtils'
import { AppointmentNotExistsError } from '../errors/AppointmentNotExistsError'
import { MissingParametersError } from '../errors/MissingParametersError'
import { UnableToUpdateError } from '../errors/UnableToUpdateError'

export class UpdateAppointmentService {
  async updateAppointment(id: string, status: string): Promise<Appointment> {
    if (!id) {
      throw new MissingParametersError('É necessário informar o id do agendamento')
    }
    
    if (!status) {
      throw new MissingParametersError('É necessário informar o status')
    }
    
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
    });

    if (!existingAppointment) {
      throw new AppointmentNotExistsError('Agendamento não encontrado');
    }

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
    } catch (err) {
      throw new UnableToUpdateError('Não foi possível atualizar o agendamento')
    }
  }

  private async validateStatus(status: string): Promise<string> {
    const translatedStatus = mapStatusToEnglish(status)
    const isValidStatus = VALID_STATUSES.includes(translatedStatus)
    if (!isValidStatus) {
      throw new InvalidStatusError('Status inexistente')
    }
    return translatedStatus
  }
}

export const updateAppointmentService = new UpdateAppointmentService()