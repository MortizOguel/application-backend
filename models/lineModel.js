const { pool } = require('../config/db')

const Line = {
    create: async(data) => {
        const query = `INSERT INTO lines (name, worktime, workdays, type, details) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [data.name, data.worktime, data.workdays, data.type, data.details]
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    update: async (id, data) => {
        const query = `UPDATE "lines" SET name = $1, worktime = $2, type = $3 WHERE id_line = $4 RETURNING *`
        const values = [data.name, data.worktime, data.type, id]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    delete: async (id) => {
        // Verificación de dependencias antes de intentar eliminar
        const checkQuery = `SELECT (SELECT COUNT(*) FROM drivers WHERE id_line = $1) AS drivers_count,(SELECT COUNT(*) FROM units WHERE id_line = $1) AS units_count,(SELECT COUNT(*) FROM routes WHERE id_line = $1) AS routes_count`
        const res = await pool.query(checkQuery, [id])
        const { drivers_count, units_count, routes_count } = res.rows[0]

        if (parseInt(drivers_count) > 0 || parseInt(units_count) > 0 || parseInt(routes_count) > 0) {
            throw new Error('No se puede eliminar: la línea tiene conductores, unidades o rutas asociadas')
        }

        const deleteQuery = 'DELETE FROM "lines" WHERE id_line = $1'
        await pool.query(deleteQuery, [id])
    },

    getAll: async () => {
    const { rows } = await pool.query('SELECT * FROM lines ORDER BY id_line ASC');
    return rows;
  }
}

module.exports = Line;