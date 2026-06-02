const { pool } = require('../config/db')

const getBrands = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_brand, brand_name, brand_description FROM brands ORDER BY brand_name'
    )
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener marcas'})
  }
}

module.exports = { getBrands }
