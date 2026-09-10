require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const crypto = require("crypto");

const PORT = process.env.PORT || 5000

const mysql = require("./modules/db");

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    mysql.query(sql, [email, username], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length > 0) {
            return res.status(422).json({ error: "User already exists" });
        }else{
            const sql = "INSERT INTO users (username, email, password , UUID) VALUES (?, ?, ? , ?)";
            const hashedPassword = await bcrypt.hash(password, 10);
            const UUID = crypto.randomUUID();
            mysql.query(sql, [username, email, hashedPassword, UUID], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                if(result.affectedRows > 0){
                    return res.status(200).json({ message: "User registered successfully" });
                };
            });
        }
    });
});
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    // 1. استخدام 422 للبيانات الناقصة بدلاً من 400
    if (!username || !password) {
        return res.status(422).json({ error: "Username and password are required" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    mysql.query(sql, [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        // 2. استخدام 401 بدلاً من 400 عند عدم وجود المستخدم
        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // 3. استخدام 401 بدلاً من 400 عند خطأ كلمة المرور
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token });
    });
});


app.listen(PORT , (req , res) => {
    console.log("Server Running on PORT : " , PORT);
});

