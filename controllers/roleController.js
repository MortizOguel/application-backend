const Role = require('../models/roleModel')

const GetRoles = async (req, res) => {
    try {
        const roles = await Role.getAll()
        res.status(200).json(roles)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener roles',
            error: error.message
        })
    }
}

module.exports = { GetRoles }
