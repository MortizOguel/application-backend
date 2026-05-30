const Driver = require('../models/driverModel')

const GetMyDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.getByIdUser(req.user.id_user)
        if (!driver) {
            return res.status(404).json({
                message: 'No tienes un perfil de conductor asociado'
            })
        }
        res.status(200).json(driver)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener perfil de conductor',
            error: error.message
        })
    }
}

module.exports = { GetMyDriverProfile }
