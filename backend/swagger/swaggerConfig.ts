import swaggerJSDoc from 'swagger-jsdoc'
import { env } from '../src/env/env'
import { components } from './swaggerComponents'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API para Agendamentos de Vacinas',
    version: '1.0.4',
    description:
      'Esta é uma API desenvolvida para o gerenciamento de agendamentos de vacinas.',
    contact: {
      name: 'Mader Gabriel',
      email: 'madergabriel2@gmail.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Servidor Local',
    },
  ],
  components: {
    ...components,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['./swagger/swaggerDocumentation.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
