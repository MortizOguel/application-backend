const app = require('./app.js')
require('dotenv').config()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Servidor de gestion de transporte ejecutandose en el puerto ${PORT}`)
    console.log('Control de acceso mediante JWT activado')
})