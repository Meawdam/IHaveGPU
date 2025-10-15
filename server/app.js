const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

env.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
// app.use(session({
//     secret
// }));

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect((err) => {
    if(err) {
        console.error("Cannot connect to database!!!");
    } else {
        console.log("Connected to database completed");
    }
});


app.post("/register", async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) return res.status(400).json({message: "All fields are require!!!"});
    try{
        const [existingUser] = await con.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if(existingUser.length > 0) return res.status(409).json({message: "User is already exists"});
        const hashedPassword = await bcrypt.hash(password, 10);

        await con.promise().query("INSERT INTO users (username, email, password) VALUE(?, ?, ?)", [username, email, hashedPassword]);
        res.status(201).json({message: "User registered succesfully"});
        } catch(error) {
        console.error(error);
        res.status(500).json({message: "Database error"});
    }
});

// app.post("/login", async (req, res) => {
//     const {email, password} = req.body;
//     if(!email || !password) return  res.status(400).json({message: "All fields are require!!!"});
//     try{
//         const [user]
//     }catch(error) {

//     }
// })

app.get("/products", (req, res) => {
    con.query("SELECT * FROM products", (error, result) => {
        if(error) return res.status(500).json({message: "Database error", error});
        res.status(200).json(result);
    })
})

app.get("/", (req, res) => {
    res.send(process.env.DB_NAME);
});

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is running");
});