const mysql = require('mysql');
const config = require('./config');

// MySQL Connection
const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    port: config.database.port
});



module.exports = connection;