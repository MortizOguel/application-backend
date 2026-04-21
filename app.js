const express = require('express')
const cors = require('cors')
require('dotenv').config()

const UserRoutes = require('./routes/userRoutes')
const UnitRoutes = require('./routes/unitRoutes')
const RouteRoutes = require('./routes/routeRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', UserRoutes)
app.use('/api/units', UnitRoutes)
app.use('/api/routes', RouteRoutes)

app.get('/api/status', (req, res) => {
    res.json({
        status: 'operativo',
        municipio: 'San Cristóbal',
        entorno: 'Backend'
    })
})

module.exports = app