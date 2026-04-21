const jwt = require('jsonwebtoken')
require('dotenv').config()

const VerifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']

    // La validación debe estar DENTRO de la función
    if (!bearerHeader) {
        return res.status(403).json({
            message: 'Acceso denegado: Cabecera de autorizacion ausente'
        })
    }

    const token = bearerHeader.split(' ')[1]

    try {
        // Verificacion mediante la clave secreta institucional
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next() // Permite el paso al siguiente controlador
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalido o expirado'
        })
    }
}

module.exports = { VerifyToken }