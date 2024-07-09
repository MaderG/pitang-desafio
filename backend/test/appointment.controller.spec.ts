import request from 'supertest'
import express, { Request, Response } from 'express';
import AppointmentController from '../src/controller/appointment.controller';
import { createAppointmentService } from '../src/services/createAppointment.service';
import { listAppointmentService } from '../src/services/listAppointment.service';
import { updateAppointmentService } from '../src/services/updateAppointment.service';
import { availableAppointmentService } from '../src/services/availableAppointment.service';
import { handleErrorResponse } from '../src/utils/handleErrorResponse';

// Mock the services and utility functions
jest.mock('../src/services/createAppointment.service');
jest.mock('../src/services/listAppointment.service');
jest.mock('../src/services/updateAppointment.service');
jest.mock('../src/services/availableAppointment.service');
jest.mock('../src/utils/handleErrorResponse');

const app = express();
app.use(express.json());

const controller = new AppointmentController();

app.post('/appointments', (req: Request, res: Response) => controller.create(req, res));
app.get('/appointments', (req: Request, res: Response) => controller.index(req, res));
app.put('/appointments/:id', (req: Request, res: Response) => controller.update(req, res));
app.get('/appointments/available-days', (req: Request, res: Response) => controller.listAvailableDays(req, res));
app.get('/appointments/available-times', (req: Request, res: Response) => controller.listAvailableTimes(req, res));
app.get('/appointments/unavailable-days', (req: Request, res: Response) => controller.listUnavailableDays(req, res));

describe('AppointmentController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an appointment and return 201', async () => {
      const mockAppointment = { id: '1', name: 'John Doe', birthDate: '1990-01-01', date: '2025-01-01', time: '10:00', status: 'PENDING' };
      const createAppointmentMock = createAppointmentService.createAppointment as jest.Mock;
      createAppointmentMock.mockResolvedValue(mockAppointment);
      const res = await request(app)
        .post('/appointments')
        .send({ name: 'John Doe', birthDate: '1990-01-01', date: '2025-01-01', time: '10:00', status: 'PENDING' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockAppointment);
    }, 10000);

    it('should handle validation error', async () => {
      const error = new Error('Validation Error');
      (createAppointmentService.createAppointment as jest.Mock).mockRejectedValue(error);
      (handleErrorResponse as jest.Mock).mockImplementation((err: Error, res: Response) => res.status(400).json({ error: err.message }));

      const res = await request(app)
        .post('/appointments')
        .send({ date: 'invalid-date', time: '10:00', status: 'PENDING' });

      expect(res.status).toBe(400);
    });
  });

  describe('index', () => {
    it('should list appointments and return 200', async () => {
      const mockAppointments = { totalPages: 1, appointments: [] };
      (listAppointmentService.listAppointments as jest.Mock).mockResolvedValue(mockAppointments);

      const res = await request(app).get('/appointments');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAppointments);
    });

    it('should handle error', async () => {
      const error = new Error('Error listing appointments');
      (listAppointmentService.listAppointments as jest.Mock).mockRejectedValue(error);
      (handleErrorResponse as jest.Mock).mockImplementation((err: Error, res: Response) => res.status(500).json({ error: err.message }));

      const res = await request(app).get('/appointments');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error listing appointments' });
    });
  });

  describe('update', () => {
    it('should update an appointment and return 200', async () => {
      const mockAppointment = { id: '1', date: '2023-01-01', time: '10:00', status: 'completed' };
      (updateAppointmentService.updateAppointment as jest.Mock).mockResolvedValue(mockAppointment);

      const res = await request(app)
        .put('/appointments/1')
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAppointment);
    });

    it('should handle error', async () => {
      const error = new Error('Error updating appointment');
      (updateAppointmentService.updateAppointment as jest.Mock).mockRejectedValue(error);
      (handleErrorResponse as jest.Mock).mockImplementation((err: Error, res: Response) => res.status(500).json({ error: err.message }));

      const res = await request(app)
        .put('/appointments/1')
        .send({ status: 'completed' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error updating appointment' });
    });
  });

  describe('listAvailableDays', () => {
    it('should list available days and return 200', async () => {
      const mockDays = ['2023-01-01', '2023-01-02'];
      (availableAppointmentService.listAvailableDays as jest.Mock).mockResolvedValue(mockDays);

      const res = await request(app).get('/appointments/available-days');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDays);
    });

    it('should handle error', async () => {
      const error = new Error('Error listing available days');
      (availableAppointmentService.listAvailableDays as jest.Mock).mockRejectedValue(error);
      (handleErrorResponse as jest.Mock).mockImplementation((err: Error, res: Response) => res.status(500).json({ error: err.message }));

      const res = await request(app).get('/appointments/available-days');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error listing available days' });
    });
  });

  describe('listAvailableTimes', () => {
    it('should list available times and return 200', async () => {
      const mockTimes = ['10:00', '11:00'];
      (availableAppointmentService.listAvailableTimes as jest.Mock).mockResolvedValue(mockTimes);

      const res = await request(app).get('/appointments/available-times').query({ date: '2023-01-01' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTimes);
    });

    it('should handle error', async () => {
      const error = new Error('Error listing available times');
      (availableAppointmentService.listAvailableTimes as jest.Mock).mockRejectedValue(error);
      (handleErrorResponse as jest.Mock).mockImplementation((err: Error, res: Response) => res.status(500).json({ error: err.message }));

      const res = await request(app).get('/appointments/available-times').query({ date: '2023-01-01' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error listing available times' });
    });
  });

  describe('listUnavailableDays', () => {
    it('should list unavailable days and return 200', async () => {
      const mockDays = ['2023-01-01', '2023-01-02'];
      (availableAppointmentService.listUnavailableDays as jest.Mock).mockResolvedValue(mockDays);

      const res = await request(app).get('/appointments/unavailable-days');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDays);
    });

    it('should handle error', async () => {
      const error = new Error('Error listing unavailable days');
      (availableAppointmentService.listUnavailableDays as jest.Mock).mockRejectedValue(error);
      (handleErrorResponse as jest.Mock).mockImplementation((err: Error, res: Response) => res.status(500).json({ error: err.message }));

      const res = await request(app).get('/appointments/unavailable-days');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error listing unavailable days' });
    });
  });
});
