import { ListAppointmentService } from '../../src/services/listAppointment.service';
import { prisma } from '../../src/lib/prisma';
import { AppointmentQuery } from '../../src/types/AppointmentQuery';
import { Appointment } from '@prisma/client';
import { InvalidDateError } from '../../src/errors/InvalidDateError';
import { InvalidStatusError } from '../../src/errors/InvalidStatusError';
import { InvalidSortByError } from '../../src/errors/InvalidSortByError';
import { mapStatusesToEnglish } from '../../src/utils/statusUtils';
import { InvalidParamsError } from '../../src/errors/InvalidParamsError';

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    appointment: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('../../src/utils/statusUtils', () => ({
  mapStatusesToEnglish: jest.fn(),
}));

const mockAppointments: Appointment[] = [
  {
    id: 1,
    name: 'John Doe',
    birthDate: new Date('1990-01-01'),
    date: new Date('2023-01-01T10:00:00.000Z'),
    status: ''
  },
  {
    id: 2,
    name: 'Jane Smith',
    birthDate: new Date('1985-05-05'),
    date: new Date('2023-01-02T11:00:00.000Z'),
    status: ''
  },
];

describe('ListAppointmentService', () => {
  const service = new ListAppointmentService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list appointments successfully', async () => {
    const query: AppointmentQuery = {
      page: '1',
      limit: '10',
      date: '2023-01-01',
      status: 'Pendente',
      sortBy: 'date',
      order: 'asc',
    };

    (prisma.appointment.findMany as jest.Mock).mockResolvedValue(mockAppointments);
    (prisma.appointment.count as jest.Mock).mockResolvedValue(mockAppointments.length);
    (mapStatusesToEnglish as jest.Mock).mockReturnValue(['PENDING']);

    const result = await service.listAppointments(query);

    expect(result.appointments).toEqual(mockAppointments);
    expect(result.totalPages).toEqual(1);
    expect(prisma.appointment.findMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date('2022-12-31T03:00:00.000Z'), // alteração de data devido ao fuso do brasil
          lte: new Date('2023-01-01T02:59:59.999Z'),
        },
        status: { in: ['PENDING'] },
      },
      take: 10,
      skip: 0,
      orderBy: { date: 'asc' },
    });
  });

  it('should return empty list when no appointments are found', async () => {
    const query: AppointmentQuery = {
      page: '1',
      limit: '10',
      date: '2023-01-01',
      status: 'Pendente',
      sortBy: 'date',
      order: 'asc',
    };

    (prisma.appointment.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.appointment.count as jest.Mock).mockResolvedValue(0);
    (mapStatusesToEnglish as jest.Mock).mockReturnValue(['PENDING']);

    const result = await service.listAppointments(query);

    expect(result.appointments).toEqual([]);
    expect(result.totalPages).toEqual(0);
    expect(prisma.appointment.findMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date('2022-12-31T03:00:00.000Z'), // alteração de data devido ao fuso do brasil
          lte: new Date('2023-01-01T02:59:59.999Z'),
        },
        status: { in: ['PENDING'] },
      },
      take: 10,
      skip: 0,
      orderBy: { date: 'asc' },
    });
  })

  it('should throw InvalidParamsError for page greater than totalPages', async () => {
    const query: AppointmentQuery = {
      page: '2',
      limit: '10',
      date: '2023-01-01',
      status: 'Pendente',
      sortBy: 'date',
      order: 'asc',
    };

    (prisma.appointment.count as jest.Mock).mockResolvedValue(1);
    (mapStatusesToEnglish as jest.Mock).mockReturnValue(['PENDING']);

    await expect(service.listAppointments(query)).rejects.toThrow(InvalidParamsError);
  })

  it('should throw InvalidParamsError for invalid page parameter', async () => {
    const query: AppointmentQuery = {
      page: 'invalid-page',
      limit: '10',
      date: '2023-01-01',
      status: 'scheduled',
      sortBy: 'date',
      order: 'asc',
    };

    await expect(service.listAppointments(query)).rejects.toThrow(InvalidParamsError);
  })

  it('should throw InvalidDateError for invalid date format', async () => {
    const query: AppointmentQuery = {
      page: '1',
      limit: '10',
      date: 'invalid-date',
      status: 'scheduled',
      sortBy: 'date',
      order: 'asc',
    };

    await expect(service.listAppointments(query)).rejects.toThrow(InvalidDateError);
  });

  it('should throw InvalidSortByError for invalid sort parameter', async () => {
    const query: AppointmentQuery = {
      page: '1',
      limit: '10',
      date: '2023-01-01',
      status: 'scheduled',
      sortBy: 'invalid-sort',
      order: 'asc',
    };

    await expect(service.listAppointments(query)).rejects.toThrow(InvalidSortByError);
  });

  it('should throw InvalidStatusError for invalid status', async () => {
    const query: AppointmentQuery = {
      page: '1',
      limit: '10',
      date: '2023-01-01',
      status: 'invalid-status',
      sortBy: 'date',
      order: 'asc',
    };

    (mapStatusesToEnglish as jest.Mock).mockReturnValue(['invalid-status']);

    await expect(service.listAppointments(query)).rejects.toThrow(InvalidStatusError);
  });

  it('should apply date and status filters correctly', async () => {
    const query: AppointmentQuery = {
      page: '1',
      limit: '10',
      date: '2023-01-01',
      status: 'FINISHED,PENDING',
      sortBy: 'date',
      order: 'asc',
    };

    (prisma.appointment.findMany as jest.Mock).mockResolvedValue(mockAppointments);
    (prisma.appointment.count as jest.Mock).mockResolvedValue(mockAppointments.length);
    (mapStatusesToEnglish as jest.Mock).mockReturnValue(['FINISHED', 'PENDING']);

    const result = await service.listAppointments(query);

    expect(result.appointments).toEqual(mockAppointments);
    expect(result.totalPages).toEqual(1);
    expect(prisma.appointment.findMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date('2022-12-31T03:00:00.000Z'),
          lte: new Date('2023-01-01T02:59:59.999Z'),
        },
        status: { in: ['FINISHED', 'PENDING'] },
      },
      take: 10,
      skip: 0,
      orderBy: { date: 'asc' },
    });
  });
});
