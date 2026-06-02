const { Pool } = require('pg')
require('dotenv').config()

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
        : false
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    }

poolConfig.max = parseInt(process.env.DB_POOL_MAX || '20')
poolConfig.idleTimeoutMillis = parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000')
poolConfig.connectionTimeoutMillis = parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || '5000')

const pool = new Pool(poolConfig)

pool.on('error', (err) => {
  console.error('[DB] Error inesperado en el pool:', err.message)
})

pool.connect()
  .then(client => {
    console.log('[DB] Conexión exitosa a PostgreSQL')
    client.release()
  })
  .catch(err => console.error('[DB] Error al conectar:', err.message))

module.exports = { pool }