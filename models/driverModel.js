const {pool} = require('../config/db')

const Driver = {
    create: async (driverData) => {
        const { id_user, id_line, adress, admission_date, license_type, license_expiration_date, license_number, license_photo } = driverData
        const query = `INSERT INTO drivers (id_user, id_line, adress, admission_date, license_type, license_expiration_date, license_number, license_photo)VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING *`

        const values = [id_user, id_line, adress, admission_date, license_type, license_expiration_date, license_number, license_photo]
        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    update: async(id_user, data) => {
        // Construir query dinamicamente para solo actualizar campos que vienen definidos y no son null/vacios
        const updates = [];
        const values = [];
        let paramIndex = 1;

        // Helper para verificar si el valor es valido para actualizar
        const isValidValue = (val) => val !== undefined && val !== null && val !== '';

        if (isValidValue(data.id_line)) {
            updates.push(`id_line = $${paramIndex++}`);
            values.push(data.id_line);
        }
        if (isValidValue(data.adress)) {
            updates.push(`adress = $${paramIndex++}`);
            values.push(data.adress);
        }
        if (isValidValue(data.license_type)) {
            updates.push(`license_type = $${paramIndex++}`);
            values.push(data.license_type);
        }
        if (isValidValue(data.license_number)) {
            updates.push(`license_number = $${paramIndex++}`);
            values.push(data.license_number);
        }
        // license_photo: solo actualizar si hay un nuevo archivo (valor no vacio)
        if (data.license_photo && data.license_photo !== null && data.license_photo !== '') {
            updates.push(`license_photo = $${paramIndex++}`);
            values.push(data.license_photo);
        }
        // Solo actualizar fechas si se proporcionan explicitamente
        if (isValidValue(data.license_expiration_date)) {
            updates.push(`license_expiration_date = $${paramIndex++}`);
            values.push(data.license_expiration_date);
        }
        if (isValidValue(data.admission_date)) {
            updates.push(`admission_date = $${paramIndex++}`);
            values.push(data.admission_date);
        }

        if (updates.length === 0) {
            return null; // No hay campos para actualizar
        }

        values.push(id_user);
        const query = `UPDATE drivers SET ${updates.join(', ')} WHERE id_user = $${paramIndex} RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    delete: async (id_user) => {
        const query = 'DELETE FROM drivers WHERE id_user = $1';
        await pool.query(query, [id_user]);
    },

    getAllDetailed: async() => {
        const query = `SELECT d.*, u.first_name, u.last_name, u.email, u.status, u.photo, u.id_rol, l.name as line_name FROM drivers d JOIN users u ON d.id_user = u.id_user LEFT JOIN lines l ON d.id_line = l.id_line WHERE u.status != 'deleted'`
        const { rows } = await pool.query(query)
        return rows
    },

    getDriversWithUnits: async () => {
        const query = `
            SELECT 
                d.id_driver, d.id_user, d.id_line, d.adress, d.admission_date,
                d.license_type, d.license_expiration_date, d.license_number, d.license_photo,
                u.first_name, u.last_name, u.email, u.status, u.photo, u.id_rol,
                l.name as line_name,
                un.id_unit, un.plate, un.status as unit_status, un.foto, un.id_line as unit_id_line,
                b.brand_name as unit_marca, m.model as unit_modelo,
                ul.name as unit_line_name
            FROM drivers d
            JOIN users u ON d.id_user = u.id_user
            LEFT JOIN lines l ON d.id_line = l.id_line
            LEFT JOIN units un ON un.id_driver = d.id_driver
            LEFT JOIN models m ON un.id_model = m.id_model
            LEFT JOIN brands b ON m.id_brand = b.id_brand
            LEFT JOIN lines ul ON un.id_line = ul.id_line
            WHERE u.status != 'deleted'
            ORDER BY d.id_driver ASC, un.id_unit ASC
        `
        const { rows } = await pool.query(query)
        return rows
    },

    getByIdUser: async (id_user) => {
        const query = `SELECT * FROM drivers WHERE id_user = $1`
        const { rows } = await pool.query(query, [id_user])
        return rows[0]
    }
}

module.exports = Driver