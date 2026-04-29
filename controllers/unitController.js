const Unit = require('../models/unitModel');

const createUnit = async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json({ message: 'Unidad registrada', data: unit });
  } catch (error) {
    res.status(500).json({ 
      message: 'Fallo en el servidor al registrar la unidad',
      error: error.message 
    });
  }
};

const UpdateUnit = async (req, res) => {
  try{
    const {id} = req.params;
    const {plate, id_line, id_model, status, foto} = req.body;

    const updatedUnit = await Unit.update(id, {plate, id_line, id_model, status, foto});

    if (!updatedUnit) {
      return res.status(404).json({ message: 'La unidad no fue encontrada' });
    }

    res.status(200).json({
      message: 'Unidad actualizada exitosamente',
      data: updatedUnit
    });

  }catch(error){
    res.status(500).json({
      message: 'Error en el servidor al actualizar la unidad',
      error: error.message
    })
  }
}

const DeleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    // El modelo debe intentar eliminar el registro; PostgreSQL lanzará un error
    // si existen dependencias activas (como registros de viajes o mantenimiento).
    const deleted = await Unit.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'La unidad no existe en el sistema' });
    }

    res.status(200).json({ message: 'Unidad eliminada satisfactoriamente' });
  } catch (error) {
    res.status(500).json({
      message: 'No se pudo eliminar la unidad debido a restricciones de integridad',
      error: error.message
    });
  }
};

const GetUnits = async (req, res) => {
  try {
    const units = await Unit.getAll()
    res.status(200).json(units)
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener unidades',
      error: error.message 
    })
  }
}

module.exports = { createUnit, UpdateUnit, DeleteUnit, GetUnits };