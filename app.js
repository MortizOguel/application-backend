const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', UserRoutes)

app.get('/api/status', (req, res) => {
    res.json({
        status: 'operativo',
        municipio: 'San Cristóbal',
        entorno: 'Backend'
    })
})

module.exports = {app}