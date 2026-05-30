const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                message: 'Error de autenticacion: Usuario no verificado'
            })
        }
        if (!allowedRoles.includes(req.user.id_rol)) {
            return res.status(403).json({
                message: 'Acceso denegado: No tienes permisos para realizar esta accion'
            })
        }
        next()
    }
}

module.exports = { checkRole }
