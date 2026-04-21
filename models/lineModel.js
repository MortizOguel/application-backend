const { pool } = require('../config/db')

const Line = {
    create: async(data) => {
        const query = `INSERT INTO lines (name, worktime, workdays, type, details) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const { rows } = await pool.query(query, [data.name, data.worktime, data.workdays, data.type, data.details]);
        return rows[0];
    },
    getAll: async () => {
    const { rows } = await pool.query('SELECT * FROM lines ORDER BY id_line ASC');
    return rows;
  }
}

module.exports = Line;