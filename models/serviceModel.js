const { pool } = require('../config/db')

const Service = {
    create: async (data) => {
        const query = `
            INSERT INTO services 
            (id_unit, id_route, id_driver, id_line, quantity_passenger, 
             transport_fee, transport_fee_suburban, start_date, finish_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `
        const values = [
            data.id_unit,
            data.id_route,
            data.id_driver,
            data.id_line,
            data.quantity_passenger || 0,
            data.transport_fee,
            data.transport_fee_suburban,
            data.start_date,
            data.finish_date
        ]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    getAll: async () => {
        const query = `
            SELECT s.*, 
                   u.plate as unit_plate, u.id_model as unit_model_id,
                   m.brand as unit_marca, m.model as unit_modelo,
                   r.name as route_name, r.origin as route_origin, r.destination as route_destination,
                   s.id_line as service_id_line,
                   CONCAT(us.first_name, ' ', us.last_name) as driver_name,
                   dr.license_number as driver_license,
                   l.name as line_name
            FROM services s
            LEFT JOIN units u ON s.id_unit = u.id_unit
            LEFT JOIN models m ON u.id_model = m.id_model
            LEFT JOIN routes r ON s.id_route = r.id_route
            LEFT JOIN drivers dr ON s.id_driver = dr.id_user
            LEFT JOIN users us ON dr.id_user = us.id_user
            LEFT JOIN lines l ON s.id_line = l.id_line
            ORDER BY s.start_date DESC
        `
        const { rows } = await pool.query(query)
        return rows
    },

    getById: async (id) => {
        const query = `
            SELECT s.*, 
                   u.plate as unit_plate, u.id_model as unit_model_id,
                   m.brand as unit_marca, m.model as unit_modelo,
                   r.name as route_name, r.origin as route_origin, r.destination as route_destination,
                   s.id_line as service_id_line,
                   CONCAT(us.first_name, ' ', us.last_name) as driver_name,
                   dr.license_number as driver_license,
                   l.name as line_name
            FROM services s
            LEFT JOIN units u ON s.id_unit = u.id_unit
            LEFT JOIN models m ON u.id_model = m.id_model
            LEFT JOIN routes r ON s.id_route = r.id_route
            LEFT JOIN drivers dr ON s.id_driver = dr.id_user
            LEFT JOIN users us ON dr.id_user = us.id_user
            LEFT JOIN lines l ON s.id_line = l.id_line
            WHERE s.id_service = $1
        `
        const { rows } = await pool.query(query, [id])
        return rows[0]
    },

    update: async (id, data) => {
        const query = `
            UPDATE services SET 
                id_unit = $1, 
                id_route = $2, 
                id_driver = $3, 
                id_line = $4,
                quantity_passenger = $5, 
                transport_fee = $6, 
                transport_fee_suburban = $7, 
                start_date = $8, 
                finish_date = $9 
            WHERE id_service = $10 
            RETURNING *
        `
        const values = [
            data.id_unit,
            data.id_route,
            data.id_driver,
            data.id_line,
            data.quantity_passenger || 0,
            data.transport_fee,
            data.transport_fee_suburban,
            data.start_date,
            data.finish_date,
            id
        ]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    delete: async (id) => {
        const query = 'DELETE FROM services WHERE id_service = $1 RETURNING *'
        const { rows } = await pool.query(query, [id])
        return rows.length > 0
    },

    getByDriverAndDateRange: async (id_driver, start_date, finish_date) => {
        const query = `
            SELECT * FROM services 
            WHERE id_driver = $1 
            AND start_date < $3 
            AND finish_date > $2
        `
        const { rows } = await pool.query(query, [id_driver, start_date, finish_date])
        return rows
    }
}

module.exports = Service