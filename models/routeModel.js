const { pool } = require('../config/db')

const Route = {
    create: async(data)=>{
        const query = `INSERT INTO routes (id_line, name, origin, destination, distance, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [data.id_line, data.name, data.origin, data.destination, data.distance, data.status];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
}

module.exports = Route;