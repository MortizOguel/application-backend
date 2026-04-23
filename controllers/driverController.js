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

const updateDriverData = async (req, res) => {
    try {
        const { id } = req.params; // Corresponde al id_user
        const updatedDriver = await Driver.update(id, req.body);
        
        if (!updatedDriver) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        res.status(200).json({
            message: 'Datos operativos del conductor actualizados',
            data: updatedDriver
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar atributos del conductor',
            error: error.message
        });
    }
};

const DeleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        await Driver.delete(id);
        res.status(200).json({
            message: 'El rol de conductor ha sido removido exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el registro del conductor',
            error: error.message
        });
    }
};

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

module.exports = { registerDriver, getDriversDetailed, DeleteDriver, updateDriverData }