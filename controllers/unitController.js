const Unit = require('../models/unitModel');
const Driver = require('../models/driverModel');

const createUnit = async (req, res) => {
  try {
    const { id_authorized_insurer_rcv, id_authorized_insurer_personal, policy_number_rcv, policy_number_personal, serial_chasis } = req.body;

    if (!id_authorized_insurer_rcv || !id_authorized_insurer_personal || !policy_number_rcv || !policy_number_personal || !serial_chasis) {
      return res.status(400).json({ message: 'Los datos de seguro (aseguradoras, pólizas y serial chasis) son requeridos' });
    }

    const serialRegex = /^[A-Z0-9]+$/
    if (!serialRegex.test(serial_chasis) || serial_chasis.length > 17) {
      return res.status(400).json({ message: 'El serial de chasis debe tener máximo 17 caracteres alfanuméricos' });
    }

    const existingSerial = await Unit.findBySerialChasis(serial_chasis);
    if (existingSerial) {
      return res.status(409).json({ message: 'Ya existe una unidad con este serial de chasis' });
    }

    const unit = await Unit.create(req.body);
    res.status(201).json({ message: 'Unidad registrada', data: unit });
  } catch (error) {
    res.status(500).json({ 
      message: 'Fallo en el servidor al registrar la unidad'
    });
  }
};

const UpdateUnit = async (req, res) => {
  try{
    const {id} = req.params;
    const {plate, id_line, id_model, status, foto, id_authorized_insurer_rcv, id_authorized_insurer_personal, policy_number_rcv, policy_number_personal} = req.body;

    const updatedUnit = await Unit.update(id, {plate, id_line, id_model, status, foto, id_authorized_insurer_rcv, id_authorized_insurer_personal, policy_number_rcv, policy_number_personal});

    if (!updatedUnit) {
      return res.status(404).json({ message: 'La unidad no fue encontrada' });
    }

    res.status(200).json({
      message: 'Unidad actualizada exitosamente',
      data: updatedUnit
    });

  }catch(error){
    res.status(500).json({
      message: 'Error en el servidor al actualizar la unidad'
    })
  }
}

const DeleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Unit.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'La unidad no existe en el sistema' });
    }

    res.status(200).json({ message: 'Unidad eliminada satisfactoriamente' });
  } catch (error) {
    if (error.code === 'DRIVER_ASSIGNED') {
      return res.status(409).json({
        message: error.message
      });
    }
    res.status(500).json({
      message: 'No se pudo eliminar la unidad debido a restricciones de integridad'
    });
  }
};

const GetUnits = async (req, res) => {
  try {
    const units = await Unit.getAll()
    res.status(200).json(units)
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener unidades'
    })
  }
}

const GetUnitById = async (req, res) => {
  try {
    const { id } = req.params
    const unit = await Unit.getById(id)
    if (!unit) return res.status(404).json({ message: 'Unidad no encontrada' })
    res.status(200).json(unit)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener unidad'})
  }
}

const AssignDriverToUnit = async (req, res) => {
  try {
    const { id } = req.params
    const { id_driver } = req.body

    const unit = await Unit.getById(id)
    if (!unit) {
      return res.status(404).json({ message: 'Unidad no encontrada' })
    }

    if (id_driver && unit.id_driver !== null && unit.id_driver !== undefined) {
      return res.status(409).json({
        message: 'La unidad ya tiene un conductor asignado. Desasígnela primero.'
      })
    }

    if (id_driver) {
      const query = 'SELECT * FROM drivers WHERE id_driver = $1'
      const { pool } = require('../config/db')
      const { rows } = await pool.query(query, [id_driver])
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Conductor no encontrado' })
      }
    }

    const updated = await Unit.assignDriver(id, id_driver || null)
    if (!updated) {
      return res.status(404).json({ message: 'Unidad no encontrada' })
    }

    res.status(200).json({
      message: id_driver ? 'Conductor asignado exitosamente' : 'Conductor desasignado exitosamente',
      data: updated
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al asignar conductor a la unidad'
    })
  }
}

module.exports = { createUnit, UpdateUnit, DeleteUnit, GetUnits, GetUnitById, AssignDriverToUnit };