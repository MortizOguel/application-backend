const AuthorizedInsurer = require('../models/authorizedInsurerModel')

const createInsurer = async (req, res) => {
  try {
    const { name_authorized_insurer, credential_insurer, insurer_rif } = req.body

    if (!name_authorized_insurer || !credential_insurer || !insurer_rif) {
      return res.status(400).json({ message: 'Nombre, credencial y RIF son requeridos' })
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
    if (!nameRegex.test(name_authorized_insurer)) {
      return res.status(400).json({
        message: 'El nombre solo puede contener letras (incluyendo acentos) y espacios',
      })
    }

    const credentialRegex = /^ES-\d{3}$/
    if (!credentialRegex.test(credential_insurer)) {
      return res.status(400).json({
        message: 'Formato de credencial inválido. Debe ser ES-123 (ej: ES-001, ES-999)',
      })
    }

    const existingRif = await AuthorizedInsurer.findByRif(insurer_rif)
    if (existingRif) {
      return res.status(409).json({ message: 'Ya existe una aseguradora con este RIF' })
    }

    const existingName = await AuthorizedInsurer.findByName(name_authorized_insurer)
    if (existingName) {
      return res.status(409).json({ message: 'Ya existe una aseguradora con este nombre' })
    }

    const existingCredential = await AuthorizedInsurer.findByCredential(credential_insurer)
    if (existingCredential) {
      return res.status(409).json({ message: 'Ya existe una aseguradora con esta credencial' })
    }

    const insurer = await AuthorizedInsurer.create(req.body)
    res.status(201).json({ message: 'Aseguradora registrada', data: insurer })
  } catch (error) {
    if (error.code === '23505') {
      let msg = 'Ya existe una aseguradora con este RIF'
      if (error.constraint === 'authorized_insurer_name_key') msg = 'Ya existe una aseguradora con este nombre'
      if (error.constraint === 'authorized_insurer_credential_key') msg = 'Ya existe una aseguradora con esta credencial'
      return res.status(409).json({ message: msg })
    }
    res.status(500).json({
      message: 'Fallo en el servidor al registrar la aseguradora',
    })
  }
}

const GetInsurers = async (req, res) => {
  try {
    const insurers = await AuthorizedInsurer.getAll()
    res.status(200).json(insurers)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener aseguradoras',
    })
  }
}

const GetInsurerById = async (req, res) => {
  try {
    const { id } = req.params
    const insurer = await AuthorizedInsurer.getById(id)
    if (!insurer) return res.status(404).json({ message: 'Aseguradora no encontrada' })
    res.status(200).json(insurer)
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener aseguradora',
    })
  }
}

const UpdateInsurer = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }
    delete updateData.insurer_rif
    delete updateData.credential_insurer

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
    if (updateData.name_authorized_insurer && !nameRegex.test(updateData.name_authorized_insurer)) {
      return res.status(400).json({
        message: 'El nombre solo puede contener letras (incluyendo acentos) y espacios',
      })
    }

    if (updateData.name_authorized_insurer) {
      const existingName = await AuthorizedInsurer.findByName(updateData.name_authorized_insurer, id)
      if (existingName) {
        return res.status(409).json({ message: 'Ya existe una aseguradora con este nombre' })
      }
    }

    const updated = await AuthorizedInsurer.update(id, updateData)
    if (!updated) return res.status(404).json({ message: 'Aseguradora no encontrada' })
    res.status(200).json({ message: 'Aseguradora actualizada', data: updated })
  } catch (error) {
    if (error.code === '23505') {
      let msg = 'Ya existe una aseguradora con este RIF'
      if (error.constraint === 'authorized_insurer_name_key') msg = 'Ya existe una aseguradora con este nombre'
      if (error.constraint === 'authorized_insurer_credential_key') msg = 'Ya existe una aseguradora con esta credencial'
      return res.status(409).json({ message: msg })
    }
    res.status(500).json({
      message: 'Error al actualizar aseguradora',
    })
  }
}

const DeleteInsurer = async (req, res) => {
  try {
    const { id } = req.params
    const hasUnits = await AuthorizedInsurer.hasUnits(id)
    if (hasUnits) {
      return res.status(409).json({
        message: 'No se puede eliminar la aseguradora porque está siendo usada por una o más unidades',
      })
    }
    const deleted = await AuthorizedInsurer.delete(id)
    if (!deleted) return res.status(404).json({ message: 'Aseguradora no encontrada' })
    res.status(200).json({ message: 'Aseguradora eliminada correctamente' })
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar aseguradora',
    })
  }
}

module.exports = { createInsurer, GetInsurers, GetInsurerById, UpdateInsurer, DeleteInsurer }
