const { pool } = require('../config/db')

const Route = {
    create: async(data)=>{
        const query = `INSERT INTO routes (id_line, name, origin, destination, distance, status, puntos_control, coordenadas_inicio, coordenadas_llegada, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        const values = [
            data.id_line, 
            data.name, 
            data.origin, 
            data.destination, 
            data.distance, 
            data.status, 
            JSON.stringify(data.puntosControl || []), 
            JSON.stringify(data.coordenadasInicio || null), 
            JSON.stringify(data.coordenadasLlegada || null),
            data.details || ''
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    update: async(id, data) => {
        const query = `UPDATE routes SET id_line = $1, name = $2, origin = $3, destination = $4, distance = $5, status = $6, puntos_control = $7, coordenadas_inicio = $8, coordenadas_llegada = $9, details = $10 WHERE id_route = $11 RETURNING *`;

        const values = [
            data.id_line, 
            data.name, 
            data.origin, 
            data.destination, 
            data.distance, 
            data.status, 
            JSON.stringify(data.puntosControl || []), 
            JSON.stringify(data.coordenadasInicio || null), 
            JSON.stringify(data.coordenadasLlegada || null),
            data.details || '',
            id
        ]
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
        return rows.map(r => ({
            ...r,
            puntosControl: r.puntos_control,
            coordenadasInicio: r.coordenadas_inicio,
            coordenadasLlegada: r.coordenadas_llegada
        }))
    },
}

module.exports = Route;