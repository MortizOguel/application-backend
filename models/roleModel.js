const pool = require('../config/db')

const Role = {
    getAll: async()=>{
        const query = 'SELECT * FROM roles ORDER BY id_rol ASC'
        const { rows } = await pool.query(query)
        return rows
    },

    getByid: async (id_rol)=>{
        const query = 'SELECT * FROM roles WHERE id_rol = $1'
        const { rows } = await pool.query(query, [id_rol])
        return rows[0]
    }
}

module.exports = Role