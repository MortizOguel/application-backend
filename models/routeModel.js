const { pool } = require('../config/db')

const Route = {
    create: async(data)=>{
        const query = `INSERT INTO routes (id_line, name, origin, destination, distance, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [data.id_line, data.name, data.origin, data.destination, data.distance, data.status];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    update: async(id, routeData) => {
        const { id_line, name, origin, destination, distance, status } = routeData
        const query = 'UPDATE routes SET id_line = $1, name = $2, origin = $3, destination = $4, distance = $5, status = $6 WHERE id_route = $7 RETURNING *';

        const values = [id_line, name, origin, destination, distance, status, id]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },
  delete: async (id) => {
        const query = 'DELETE FROM routes WHERE id_route = $1 RETURNING *'
        const { rows } = await pool.query(query, [id])
        return rows.length > 0
    },
    getAll: async () => {
        const query = 'SELECT * FROM routes ORDER BY id_route ASC'
        const { rows } = await pool.query(query)
        return rows
    },
}

module.exports = Route;