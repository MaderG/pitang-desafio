// clear database
import { prisma } from "../lib/prisma";

async function clearDb() {
    await prisma.appointment.deleteMany()
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Appointment';`
    console.log('Banco de dados limpo com sucesso')
}

clearDb()