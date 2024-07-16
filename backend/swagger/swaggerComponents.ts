export const components = {
  schemas: {
    AppointmentCreate: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          example: '2020-02-19',
        },
        date: {
          type: 'string',
          format: 'date',
          example: '2025-07-15',
        },
        time: {
          type: 'string',
          format: 'time',
          example: '14:00',
        }
      },
      required: ['date', 'time', 'nme', 'birthDate'],
    },
    AppointmentUpdate: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '1',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          example: '2020-02-19',
        },
        date: {
          type: 'string',
          format: 'date',
          example: '5-07-15',
        },
        time: {
          type: 'string',
          format: 'time',
          example: '14:00',
        },
        status: {
          type: 'string',
          enum: ['PENDING', 'FINISHED', 'CANCELED'],
          example: 'FINISHED',
        }
      }
    },
    Appointment: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '1',
        },
        birthDate: {
          type: 'string',
          format: 'date',
          example: '2020-02-19',
        },
        date: {
          type: 'string',
          format: 'date',
          example: '2025-07-15',
        },
        time: {
          type: 'string',
          format: 'time',
          example: '14:00',
        },
        status: {
          type: 'string',
          enum: ['PENDING', 'FINISHED', 'CANCELED'],
          example: 'PENDING',
        }
      },
      required: ['id', 'date', 'time', 'patientId', 'vaccineId', 'status', 'createdAt', 'updatedAt'],
    },
  },
};
