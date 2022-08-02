const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

module.exports = db;