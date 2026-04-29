const express = require('express')
const cors = require('cors')
require('dotenv').config()

const UserRoutes = require('./routes/userRoutes')
const UnitRoutes = require('./routes/unitRoutes')
const RouteRoutes = require('./routes/routeRoutes')
const LineRoutes = require('./routes/lineRoutes')
const DriverRoutes = require('./routes/driverRoutes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Middleware de registro de peticiones para depuración
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.use('/api/users', UserRoutes)
app.use('/api/units', UnitRoutes)
app.use('/api/routes', RouteRoutes)
app.use('/api/lines', LineRoutes)
app.use('/api/drivers', DriverRoutes)

app.get('/api/status', (req, res) => {
    res.json({
        status: 'operativo',
        municipio: 'San Cristóbal',
        entorno: 'Backend'
    })
})

module.exports = app