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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect((err) => {
    if(err) {
        console.error("Cannot connect to database!!!", err.message);
    } else {
        console.log("Connected to database completed");
    }
});

app.get("/user", (req, res) => {
    if(req.session.user){
        res.status(200).json({loggedIn: true, user: req.session.user, message: "User is logged in"});
    } else{
        res.status(401).json({loggedIn: false});
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

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return  res.status(400).json({message: "All fields are require!!!"});
    try{
        const [users] = await con.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if(users.length === 0) return res.status(404).json({message: "User not found"});
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message: "Invalid password"});

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        res.status(200).json({message: "Login successful", user: req.session.user});
    }catch(error) {
        console.error(error)
        res.status(500).json({message: "Database error"})
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if(error) return res.status(500).json({message: "Logout Failed"});
        res.clearCookie("connect.sid");
        res.status(200).json({message: "Logout successful", loggedIn: false});
    });
});

app.get("/products", (req, res) => {
    con.query("SELECT * FROM products", (error, result) => {
        if(error) return res.status(500).json({message: "Database error", error, error: error.message});
        res.status(200).json(result);
    })
})

app.get("/", (req, res) => {
    res.send(process.env.DB_NAME);
});

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is running...");
});