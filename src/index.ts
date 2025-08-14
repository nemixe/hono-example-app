import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/error'
import alatRouter from './routes/alat'
import authRouter from './routes/auth'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())
app.use('*', errorHandler)

app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'CV. Amanah Elektronik API',
    data: {
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        equipment: '/api/alat'
      }
    },
    errors: null
  })
})

app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'Service is healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    },
    errors: null
  })
})

app.route('/api/auth', authRouter)
app.route('/api/alat', alatRouter)

app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found',
    data: null,
    errors: 'The requested endpoint does not exist'
  }, 404)
})

const port = parseInt(process.env.PORT || '8000', 10)

export default {
  port,
  fetch: app.fetch
}
