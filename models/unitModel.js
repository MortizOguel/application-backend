const { pool } = require('../config/db')

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
  },
    update: async(id, unitData) => {
    const { id_line, id_model, plate, status } = unitData
    const query = `UPDATE units SET id_line = $1, id_model = $2, plate = $3, status = $4 WHERE id_unit = $5 RETURNING *`;

    const values = [id_line, id_model, plate, status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
    delete: async (id) => {
    const query = 'DELETE FROM units WHERE id_unit = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0; // Retorna true si un registro fue efectivamente eliminado
    },
}

module.exports = Unit