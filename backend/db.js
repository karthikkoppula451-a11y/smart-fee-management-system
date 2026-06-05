const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "Karthik@1322",
    database: process.env.MYSQLDATABASE || "fee_management",
    port: process.env.MYSQLPORT || 3307
});

db.connect((err) => {
    if (err) {
        console.log("Database Error");
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;