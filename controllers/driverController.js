const Driver = require('../models/driverModel')

const registerDriver = async (req, res) => {
  try {
    // Los datos provienen del cuerpo de la peticion (JSON)
    const newDriver = await Driver.create(req.body)
    
    res.status(201).json({
      message: 'Conductor registrado exitosamente en el sistema municipal',
      data: newDriver
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar el conductor',
      error: error.message
    })
  }
}

const getDriversDetailed = async (req, res) => {
  try {
    const drivers = await Driver.getAllDetailed()
    res.status(200).json(drivers)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la lista de conductores',
      error: error.message
    })
  }
}

module.exports = { registerDriver, getDriversDetailed }