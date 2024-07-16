import 'express-async-errors'

import express from 'express'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

import swaggerSpec from '../swagger/swaggerConfig'
import appointmentRouter from './routes/appointment.routes'

export const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors())

app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(appointmentRouter)
