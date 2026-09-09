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
            return res.status(400).json({ error: "User already exists" });
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

app.post("/api/login" , (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }else{
    const sql = "SELECT * FROM users WHERE username = ?";
        try{
            mysql.query(sql, [username], async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                if (result.length === 0) {
                    return res.status(400).json({ error: "User not found" });
                }else{
                    const user = result[0];
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        return res.status(400).json({ error: "Invalid password" });
                    }else{
                        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
                        return res.status(200).json({ message: "Login successful", token });
                    };
                };
            });
        }catch(err){
            console.error("Error during login: ", err);
            res.status(500).json({ error: "Internal server error" });
        };
    };
});


app.listen(PORT , (req , res) => {
    console.log("Server Running on PORT : " , PORT);
});

