const app = require('./app.js')
const Driver = require('./models/driverModel')
require('dotenv').config()

const PORT = process.env.PORT || 3001

app.listen(PORT, async () => {
    console.log(`Servidor de gestion de transporte ejecutandose en el puerto ${PORT}`)
    console.log('Control de acceso mediante JWT activado')

    try {
        const suspended = await Driver.suspendExpiredLicenses()
        if (suspended.length > 0) {
            console.log(`[Licencias Vencidas] ${suspended.length} conductor(es) suspendido(s) automáticamente al iniciar el servidor`)
        }
    } catch (err) {
        console.error('[Licencias Vencidas] Error en verificación inicial:', err.message)
    }
})