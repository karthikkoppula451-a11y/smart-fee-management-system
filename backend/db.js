const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Karthik@1322',
    database: 'fee_management',
    port: 3307
});

db.connect((err) => {
    if(err){
        console.log('Database Error');
        console.log(err);
    } else {
        console.log('MySQL Connected');
    }
});

module.exports = db;