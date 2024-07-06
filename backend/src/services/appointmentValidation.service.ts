import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { AppointmentInput } from '@/types/AppointmentInput';
import { BookingBoundsError } from '@/errors/BookingBounds';

class AppointmentValidationService {



  async validateAppointment(inputData: AppointmentInput, dateObj: Date): Promise<void> {
    this.checkPastDate(dateObj);
    await this.validateDailyLimit(dateObj);
    await this.validateHourlyLimit(dateObj);
    await this.validateExistingAppointment(inputData, dateObj);
  }

  private checkPastDate(dateObj: Date): void {
    if (dayjs(dateObj).isBefore(dayjs())) {
      throw new Error('Você não pode criar um agendamento no passado');
    }
  }

  private async validateDailyLimit(dateObj: Date): Promise<void> {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: dayjs(dateObj).startOf('day').toDate(),
          lte: dayjs(dateObj).endOf('day').toDate(),
        },
      },
    });

    if (appointments.length >= 20) {
      throw new BookingBoundsError('Limite de agendamentos excedido para o dia');
    }
  }

  private async validateHourlyLimit(dateObj: Date): Promise<void> {
    const appointmentsInHour = await prisma.appointment.findMany({
      where: {
        date: {
          gte: dayjs(dateObj).startOf('hour').toDate(),
          lte: dayjs(dateObj).endOf('hour').toDate(),
        },
      },
    });

    if (appointmentsInHour.length >= 2) {
      throw new BookingBoundsError('Limite de agendamentos por hora excedido');
    }
  }

  private async validateExistingAppointment(inputData: AppointmentInput, dateObj: Date): Promise<void> {
    const userAppointment = await prisma.appointment.findFirst({
      where: {
        name: inputData.name,
        birthDate: dayjs(inputData.birthDate).toDate(),
        date: dateObj,
      },
    });

    if (userAppointment) {
      throw new Error('Você já possui um agendamento');
    }
  }
}

export const appointmentValidationService = new AppointmentValidationService();
