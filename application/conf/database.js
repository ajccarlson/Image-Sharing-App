const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'ajcool01',
    database: 'csc317db',
    connectionLimit: 50,
//    waitForConnections: true,
    debug: false,
});

const promisePool = pool.promise();
module.exports = promisePool;