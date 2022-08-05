const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'db',
    password: 'passpass',
    database: 'employee_db'
});

module.exports = db;