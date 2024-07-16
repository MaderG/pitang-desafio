/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentCreate'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Erro de validação ou regra de negócio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Você não pode criar agendamento no passado.
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 8
 *         required: false
 *         description: Limite de itens por página
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T03:00:00.000Z
 *         required: false
 *         description: Data para filtrar agendamentos (formato ISO 8601, com T03:00:00.000Z para GMT -03:00)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: Pendente,Finalizado,Cancelado
 *         required: false
 *         description: Status para filtrar agendamentos(separados por vírgula, sem espaço)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, name]
 *         required: false
 *         description: Campo para ordenar os agendamentos
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *         required: false
 *         description: Ordem de classificação
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 totalPages:
 *                   type: integer
 *                 allAppointments:
 *                   type: integer
 *       400:
 *         description: Erro de validação ou parâmetro inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parâmetro de ordenação inválido."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento existente
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: Finalizado
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentUpdate'
 *       400:
 *         description: Erro de validação ou regra de negócio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing parameters, Invalid status, Unable to update appointment
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/available-days:
 *   get:
 *     summary: Lista os dias disponíveis para filtragem de agendamentos
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Dias disponíveis listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: date
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/available-times:
 *   get:
 *     summary: Lista os horários disponíveis para um dia específico
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-08-01
 *         required: true
 *         description: Data para verificar os horários disponíveis
 *     responses:
 *       200:
 *         description: Horários disponíveis listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: time
 *                 example: ["08:00", "09:00", "10:00"]
 *       400:
 *         description: Data inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Data inválida
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/unavailable-days:
 *   get:
 *     summary: Lista os dias indisponíveis para agendamento
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Dias indisponíveis listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 format: date
 *                 example: ["2024-08-01", "2024-08-02", "2024-08-03"]
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
