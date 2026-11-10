const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

module.exports = pool

// pool.query(`
//     SELECT id, title, category, amount::float AS amount, to_char(expense_date, 'YYYY-MM-DD') AS expense_date FROM expenses`).then((result) => {
//     console.log(result.rows)
// })