import { Router } from 'express'
import AppointmentController from '../controller/appointment.controller'

const appointmentRouter = Router()
const appointmentController = new AppointmentController()

appointmentRouter.use('/api/appointments', Router()
  .post('/', appointmentController.create)
  .get('/', appointmentController.index)
  .put('/:id', appointmentController.update)
);
appointmentRouter.use('/api', Router()
  .get('/available-days', appointmentController.listAvailableDays)
  .get('/available-times', appointmentController.listAvailableTimes)
  .get('/unavailable-days', appointmentController.listUnavailableDays)
);
export default appointmentRouter
