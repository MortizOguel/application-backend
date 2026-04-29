const { pool } = require('../config/db')

const Unit = {
    create: async(unitData) => {
    const { id_line, id_model, plate, status, foto } = unitData
    const query = `INSERT INTO units (id_line, id_model, plate, status, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *`

    const values = [id_line, id_model, plate, status, foto]
    const { rows } = await pool.query(query, values)
    return rows[0]
    },
    findByPlate: async (plate) => {
    const query = 'SELECT * FROM units WHERE plate = $1'
    const { rows } = await pool.query(query, [plate])
    return rows[0]
  },
    update: async(id, unitData) => {
    const { id_line, id_model, plate, status, foto } = unitData
    const query = `UPDATE units SET id_line = $1, id_model = $2, plate = $3, status = $4, foto = $5 WHERE id_unit = $6 RETURNING *`;

    const values = [id_line, id_model, plate, status, foto, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
    delete: async (id) => {
    const query = 'DELETE FROM units WHERE id_unit = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0; // Retorna true si un registro fue efectivamente eliminado
    },
    getAll: async () => {
    const query = `
      SELECT u.*, m.brand as marca, m.model as modelo 
      FROM units u 
      LEFT JOIN models m ON u.id_model = m.id_model 
      ORDER BY u.id_unit ASC
    `
    const { rows } = await pool.query(query)
    return rows
    },
}

module.exports = Unit