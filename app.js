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
app.use(express.json())

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