const Driver = require('../models/driverModel')
const User = require('../models/userModel')
const Unit = require('../models/unitModel')

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
      message: 'Error al registrar el conductor'
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
            message: 'Error al actualizar atributos del conductor'
        });
    }
};

const DeleteDriver = async (req, res) => {
    try {
        const { id } = req.params

        const userExists = await User.getById(id)
        if (!userExists) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        const driver = await Driver.getByIdUser(id)
        if (driver) {
            const assignedUnits = await Unit.getByDriverId(driver.id_driver)
            if (assignedUnits && assignedUnits.length > 0) {
                return res.status(409).json({
                    message: `No se puede eliminar el conductor: tiene ${assignedUnits.length} unidad(es) asignada(s). Desasigne las unidades primero.`,
                    assignedUnits: assignedUnits.map(u => ({ id_unit: u.id_unit, plate: u.plate }))
                })
            }
        }

        await User.delete(id)

        res.status(200).json({
            message: 'El conductor ha sido eliminado exitosamente'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el registro del conductor'
        })
    }
}

const getDriversDetailed = async (req, res) => {
  try {
    await Driver.suspendExpiredLicenses().catch(err => {
      console.error('[Auto-Suspend Error]', err.message)
    })
    const drivers = await Driver.getAllDetailed()
    res.status(200).json(drivers)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la lista de conductores'
    })
  }
}

const getDriversWithUnits = async (req, res) => {
  try {
    await Driver.suspendExpiredLicenses().catch(err => {
      console.error('[Auto-Suspend Error]', err.message)
    })
    const rows = await Driver.getDriversWithUnits()
    const driversMap = {}
    for (const row of rows) {
      const key = row.id_driver
      if (!driversMap[key]) {
        driversMap[key] = {
          id_driver: row.id_driver,
          id_user: row.id_user,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          status: row.status,
          photo: row.photo,
          id_line: row.id_line,
          line_name: row.line_name,
          adress: row.adress,
          admission_date: row.admission_date,
          license_type: row.license_type,
          license_expiration_date: row.license_expiration_date,
          license_number: row.license_number,
          license_photo: row.license_photo,
          units: []
        }
      }
      if (row.id_unit) {
        driversMap[key].units.push({
          id_unit: row.id_unit,
          plate: row.plate,
          status: row.unit_status,
          foto: row.foto,
          marca: row.unit_marca,
          modelo: row.unit_modelo,
          line_name: row.unit_line_name || '—'
        })
      }
    }
    res.status(200).json(Object.values(driversMap))
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener conductores con unidades'
    })
  }
}

module.exports = { registerDriver, getDriversDetailed, DeleteDriver, updateDriverData, getDriversWithUnits }