import 'express-async-errors'

import express from 'express'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

import swaggerSpec from '../swagger/swaggerConfig'
import appointmentRouter from './routes/appointment.routes'
import { env } from './env/env'

export const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors())

app.use(express.json())

if(env.NODE_ENV !== 'test') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

app.use(appointmentRouter)
