const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhruv@0204#2005@mysql',
    database: 'student_insight_portal'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/signup', (req, res) => {
    const user = { username: req.body.username, password: req.body.password, isAdmin: req.body.isAdmin, isLogin: req.body.isLogin, email: req.body.email };
    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.status(201).send('User created');
    });
});
let studentId = "";
app.post('/login', (req, res) => {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [req.body.username, req.body.password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (results.length > 0) {
            studentId = req.body.username; 

            let sql = `UPDATE users SET isLogin = true WHERE username = '${studentId}'`;
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log('isLogin set to true successfully.');
            });

            return res.status(200).json({ success: true, message: 'Logged in' });
        } else {
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});