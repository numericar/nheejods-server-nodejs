const mysql = require('mysql2/promise');
require('dotenv').config();

class MySQLDbContext {
    constructor () {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            connectionLimit: process.env.DB_POOL
        });

        console.log('MySQL Context instance created');
    }

    async executeAsync(query, values = []) {
        let connection;
        try {
            connection = await this.pool.getConnection();

            const [result] = await connection.execute(query, values);

            return result;
        } catch (ex) {
            throw new Error(ex.message);
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = new MySQLDbContext();