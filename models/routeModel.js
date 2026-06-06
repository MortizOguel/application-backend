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
            data.status || 'active', 
            JSON.stringify(data.puntosControl || data.puntos_control || []), 
            JSON.stringify(data.coordenadasInicio || data.coordenadas_inicio || null), 
            JSON.stringify(data.coordenadasLlegada || data.coordenadas_llegada || null),
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
            data.status || 'active', 
            JSON.stringify(data.puntosControl || data.puntos_control || []), 
            JSON.stringify(data.coordenadasInicio || data.coordenadas_inicio || null), 
            JSON.stringify(data.coordenadasLlegada || data.coordenadas_llegada || null),
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
    softDelete: async (id) => {
        const query = `UPDATE routes SET status = 'deleted' WHERE id_route = $1 RETURNING *`
        const { rows } = await pool.query(query, [id])
        return rows.length > 0
    },
    getAll: async () => {
        const query = `SELECT r.*, l.name AS line_name FROM routes r LEFT JOIN lines l ON r.id_line = l.id_line WHERE r.status != 'deleted' ORDER BY r.id_route ASC`
        const { rows } = await pool.query(query)
        return rows.map(r => ({
            ...r,
            puntosControl: r.puntos_control,
            coordenadasInicio: r.coordenadas_inicio,
            coordenadasLlegada: r.coordenadas_llegada
        }))
    },

    getByLineId: async (lineId) => {
        const query = `SELECT r.*, l.name AS line_name FROM routes r LEFT JOIN lines l ON r.id_line = l.id_line WHERE r.id_line = $1 AND r.status != 'deleted' ORDER BY r.id_route ASC`
        const { rows } = await pool.query(query, [lineId])
        return rows.map(r => ({
            ...r,
            puntosControl: r.puntos_control,
            coordenadasInicio: r.coordenadas_inicio,
            coordenadasLlegada: r.coordenadas_llegada
        }))
    },

    findByName: async (name) => {
        const { rows } = await pool.query(
            'SELECT id_route FROM routes WHERE LOWER(name) = LOWER($1) AND status != \'deleted\'',
            [name]
        )
        return rows
    },
    getById: async (id) => {
        const query = `SELECT r.*, l.name AS line_name FROM routes r LEFT JOIN lines l ON r.id_line = l.id_line WHERE r.id_route = $1 AND r.status != 'deleted'`
        const { rows } = await pool.query(query, [id])
        if (rows[0]) {
            const r = rows[0]
            return {
                ...r,
                puntosControl: r.puntos_control,
                coordenadasInicio: r.coordenadas_inicio,
                coordenadasLlegada: r.coordenadas_llegada
            }
        }
        return null
    },
}

module.exports = Route;