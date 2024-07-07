import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('Error', _env.error.format());
  
  throw new Error("Invalid enviroment variables")
}

export const env = _env.data