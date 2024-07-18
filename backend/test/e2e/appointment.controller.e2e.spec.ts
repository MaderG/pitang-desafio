import request from 'supertest'
import { app } from '../../src/app'
import { PrismaClient } from '@prisma/client'
import { Server } from 'http'

const prisma = new PrismaClient()

describe('E2E test for appointment controller', () => {
  let server: Server

  beforeAll(async () => {
    server = app.listen(4000)
  })

  afterAll(async () => {
    await server.close()
    await prisma.appointment.deleteMany()
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Appointment';`
  })

  describe('POST /api/appointments', () => {
    it('should create an appointment successfully', async () => {
      const res = await request(server).post('/api/appointments').send({
        name: 'John Doe',
        birthDate: '1980-01-01',
        date: '2025-12-20',
        time: '10:00',
      })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
    })

    it('should fail if the appointment date is in the past', async () => {
      const res = await request(server).post('/api/appointments').send({
        name: 'Jane Doe',
        birthDate: '1980-01-01',
        date: '2010-01-01',
        time: '10:00',
      })

      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/passado/i)
    })

    it('should fail if the appointment hour is full', async () => {

      await request(server).post('/api/appointments').send({
        name: 'John Doe',
        birthDate: '1980-01-01',
        date: '2025-12-20',
        time: '10:00',
      })
      
      const res = await request(server).post('/api/appointments').send({
        name: 'Jane Doe',
        birthDate: '1980-01-01',
        date: '2025-12-20',
        time: '10:00',
      })

      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/Limite de agendamentos por hora excedido/i)
    })

    it('should fail it the birth Year is earlier than 1900', async () => {
      const res = await request(server).post('/api/appointments').send({
        name: 'Jane Doe',
        birthDate: '1899-01-01',
        date: '2025-12-20',
        time: '10:00',
      })

      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/Ano inválido/i)
    })
  })

  describe('GET /api/appointments', () => {
    it('should list appointments', async () => {
      const res = await request(server)
        .get('/api/appointments')
        .query({ page: 1, limit: 10, date: '2025-12-20' })

      expect(res.status).toBe(200)
      expect(res.body.appointments).toBeInstanceOf(Array)
    })
  })

  describe('PUT /api/appointments/:id', () => {
    it('should update an appointment status', async () => {
      const res = await request(server)
        .put('/api/appointments/1')
        .send({ status: 'FINISHED' })

      expect(res.status).toBe(200)
      expect(res.body.status).toBe('FINISHED')
    })

    it('should fail if the appointment does not exist', async () => {
      const res = await request(server)
        .put('/api/appointments/999')
        .send({ status: 'FINISHED' })

      expect(res.status).toBe(404)
      expect(res.body.error).toMatch(/Agendamento não encontrado/i)
    })

    it('should fail if the status is invalid', async () => {
      const res = await request(server)
        .put('/api/appointments/1')
        .send({ status: 'INVALID' })

      expect(res.status).toBe(400)
      expect(res.body.error).toMatch(/inexistente/i)
    })
  })

  describe('GET /api/available-days', () => {
    it('should list available days', async () => {
      const res = await request(server).get('/api/available-days')

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/available-times', () => {
    it('should list available times for a given date', async () => {
      const res = await request(server)
        .get('/api/available-times')
        .query({ date: '2025-12-20' })

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/unavailable-days', () => {
    it('should list unavailable days', async () => {
      const res = await request(server).get('/api/unavailable-days')

      expect(res.status).toBe(200)
      expect(res.body).toBeInstanceOf(Array)
    })
  })
})
