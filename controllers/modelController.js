const { pool } = require('../config/db')

const getModels = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id_model, m.id_brand, b.brand_name, m.model, m.capacity, m.fuel_type, m.year_manufacture
       FROM models m
       JOIN brands b ON m.id_brand = b.id_brand
       ORDER BY b.brand_name, m.model`
    )
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener modelos'})
  }
}

module.exports = { getModels }
