const { Pool, types } = require('pg')
require('dotenv').config()

// Sobrescribe el parser de timestamp without time zone (OID 1114)
// para evitar que postgres-date convierta a Date usando la zona local
// del servidor Node.js (típicamente UTC en hosting). Al serializar a JSON,
// Date.prototype.toISOString() convierte a UTC, causando un shift de
// 4-5 horas al ser interpretado por el frontend en UTC-4 (Venezuela).
types.setTypeParser(1114, (val) => val.replace(' ', 'T'))

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