import { UpdateAppointmentService } from '../src/services/updateAppointment.service';
import { prisma } from '../src/lib/prisma';
import { InvalidStatusError } from '../src/errors/InvalidStatusError';
import { AppointmentNotExistsError } from '../src/errors/AppointmentNotExistsError';
import { mapStatusToEnglish } from '../src/utils/statusUtils';
import { Appointment } from '@prisma/client';
import { MissingParametersError } from '../src/errors/MissingParametersError';
import { UnableToUpdateError } from '../src/errors/UnableToUpdateError';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    appointment: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../src/utils/statusUtils', () => ({
  mapStatusToEnglish: jest.fn(),
}));

describe('UpdateAppointmentService', () => {
  const service = new UpdateAppointmentService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update appointment status successfully', async () => {
    const mockAppointment: Appointment = {
      id: 1,
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      date: new Date('2023-01-01T10:00:00.000Z'),
      status: 'PENDING',
    };

    (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(mockAppointment);
    (prisma.appointment.update as jest.Mock).mockResolvedValue(mockAppointment);
    (mapStatusToEnglish as jest.Mock).mockReturnValue('FINISHED');

    const result = await service.updateAppointment('1', 'FINISHED');

    expect(result).toEqual(mockAppointment);
    expect(prisma.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.appointment.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'FINISHED' },
    });
  });

  it('should throw MissingParametersError if id is not provided', async () => {
    await expect(service.updateAppointment('', 'FINISHED')).rejects.toThrow(MissingParametersError);
  });

  it('should throw MissingParametersError if status is not provided', async () => {
    await expect(service.updateAppointment('1', '')).rejects.toThrow(MissingParametersError);
  });

  it('should throw MissingParametersError if teh id is not a digit', async () => {
    await expect(service.updateAppointment('aa', 'CANCELED')).rejects.toThrow(MissingParametersError);
  });

  it('should throw InvalidStatusError for invalid status', async () => {
    (mapStatusToEnglish as jest.Mock).mockReturnValue('invalid-status');

    await expect(service.updateAppointment('1', 'invalid-status')).rejects.toThrow(InvalidStatusError);
  });

  it('should throw AppointmentNotExistsError if appointment does not exist', async () => {
    (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.updateAppointment('999', 'FINISHED')).rejects.toThrow(AppointmentNotExistsError);
  });

  it('should throw UnableToUpdateError if unable to update appointment', async () => {
    const mockAppointment: Appointment = {
      id: 1,
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      date: new Date('2023-01-01T10:00:00.000Z'),
      status: 'PENDING',
    };

    (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(mockAppointment);
    (prisma.appointment.update as jest.Mock).mockRejectedValue(new UnableToUpdateError('Unable to update'));
    (mapStatusToEnglish as jest.Mock).mockReturnValue('FINISHED');

    await expect(service.updateAppointment('1', 'FINISHED')).rejects.toThrow(UnableToUpdateError);
  });
});