const jwt = require('jsonwebtoken')
require('dotenv').config()

const VerifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    let token = null

    if (bearerHeader) {
        token = bearerHeader.split(' ')[1]
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token
    }

    if (!token) {
        return res.status(403).json({
            message: 'Acceso denegado: Token de autenticación ausente'
        })
    }

    try {
        // Verificacion mediante la clave secreta institucional
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
        req.user = decoded
        next() // Permite el paso al siguiente controlador
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalido o expirado'
        })
    }
}

module.exports = { VerifyToken }