const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.log("Database Error");
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.post("/add-student", (req, res) => {
    const {
        student_name,
        hallticket_no,
        mobile_number,
        branch,
        year,
        tuition_fee,
        library_fee,
        bus_fee
    } = req.body;

    const total_fee =
        Number(tuition_fee || 0) +
        Number(library_fee || 0) +
        Number(bus_fee || 0);

    const paid_fee = 0;
    const due_fee = total_fee;

    const sql = `
        INSERT INTO students
        (student_name, hallticket_no, mobile_number, branch, year,
        tuition_fee, library_fee, bus_fee, total_fee, paid_fee, due_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        student_name,
        hallticket_no,
        mobile_number,
        branch,
        year,
        tuition_fee,
        library_fee,
        bus_fee,
        total_fee,
        paid_fee,
        due_fee
    ], (err) => {
        if (err) res.json({ message: "Error: " + err.sqlMessage });
        else res.json({ message: "Student Added Successfully" });
    });
});

app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) res.json([]);
        else res.json(result);
    });
});

app.get("/student/:hallticket_no", (req, res) => {
    db.query(
        "SELECT * FROM students WHERE hallticket_no = ?",
        [req.params.hallticket_no],
        (err, result) => {
            if (err) res.json([]);
            else res.json(result);
        }
    );
});

app.put("/add-fee", (req, res) => {
    const { hallticket_no, tuition_fee, library_fee, bus_fee } = req.body;

    const total_fee =
        Number(tuition_fee || 0) +
        Number(library_fee || 0) +
        Number(bus_fee || 0);

    const sql = `
        UPDATE students
        SET tuition_fee = ?,
            library_fee = ?,
            bus_fee = ?,
            total_fee = ?,
            due_fee = total_fee - paid_fee
        WHERE hallticket_no = ?
    `;

    db.query(sql, [
        tuition_fee,
        library_fee,
        bus_fee,
        total_fee,
        hallticket_no
    ], (err, result) => {
        if (err) res.json({ message: "Error: " + err.sqlMessage });
        else if (result.affectedRows === 0) res.json({ message: "Student Not Found" });
        else res.json({ message: "Fee Updated Successfully" });
    });
});

app.put("/delete-fee", (req, res) => {
    const { hallticket_no, feeType, amount } = req.body;

    const allowed = ["tuition_fee", "library_fee", "bus_fee"];

    if (!allowed.includes(feeType)) {
        return res.json({ message: "Select valid fee type" });
    }

    const sql = `
        UPDATE students
        SET ${feeType} = GREATEST(${feeType} - ?, 0),
            total_fee = GREATEST(tuition_fee + library_fee + bus_fee - ?, 0),
            due_fee = GREATEST(tuition_fee + library_fee + bus_fee - ? - paid_fee, 0)
        WHERE hallticket_no = ?
    `;

    db.query(sql, [amount, amount, amount, hallticket_no], (err, result) => {
        if (err) res.json({ message: "Error: " + err.sqlMessage });
        else if (result.affectedRows === 0) res.json({ message: "Student Not Found" });
        else res.json({ message: "Fee Deleted Successfully" });
    });
});

app.delete("/delete-student/:hallticket_no", (req, res) => {
    db.query(
        "DELETE FROM students WHERE hallticket_no = ?",
        [req.params.hallticket_no],
        (err, result) => {
            if (err) res.json({ message: "Error: " + err.sqlMessage });
            else if (result.affectedRows === 0) res.json({ message: "Student Not Found" });
            else res.json({ message: "Student Deleted Successfully" });
        }
    );
});

app.get("/history/:hallticket_no", (req, res) => {
    db.query(
        "SELECT hallticket_no, student_name, branch, year, paid_fee AS amount FROM students WHERE hallticket_no = ?",
        [req.params.hallticket_no],
        (err, result) => {
            if (err) res.json([]);
            else res.json(result);
        }
    );
});

app.get("/totals", (req, res) => {
    const sql = `
        SELECT
            COUNT(*) AS totalStudents,
            IFNULL(SUM(paid_fee),0) AS paidFee,
            IFNULL(SUM(due_fee),0) AS dueFee
        FROM students
    `;

    db.query(sql, (err, result) => {
        if (err) res.json({ totalStudents: 0, paidFee: 0, dueFee: 0 });
        else res.json(result[0]);
    });
});

app.post("/create-student-account", (req, res) => {
    const { hallticket_no, username, password } = req.body;

    const sql = `
        INSERT INTO student_accounts
        (hallticket_no, username, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [hallticket_no, username, password], (err) => {
        if (err) {
            res.json({ message: "Error: " + err.sqlMessage });
        } else {
            res.json({ message: "Student Account Saved Successfully" });
        }
    });
});

app.post("/student-login", (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    const sql = `
        SELECT * FROM student_accounts
        WHERE TRIM(username) = ?
        AND TRIM(password) = ?
    `;

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: "Login Error"
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Invalid Student Login"
            });
        }

        res.json({
            success: true,
            message: "Login Successful",
            hallticket_no: result[0].hallticket_no
        });
    });
});

app.listen(5000, () => {
    console.log("Server Running On Port 5000");
});