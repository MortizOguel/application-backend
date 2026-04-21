const pool = require('../config/db')

const Unit = {
    create: async(unitData) => {
        const { id_line, id_model, plate, status } = unitData
        const query = `INSERT INTO units (id_line, id_model, plate, status)VALUES ($1, $2, $3, $4)RETURNING *`

        const values = [id_line, id_model, plate, status]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },
    findByPlate: async (plate) => {
    const query = 'SELECT * FROM units WHERE plate = $1'
    const { rows } = await pool.query(query, [plate])
    return rows[0]
  }

}

module.exports = Unit