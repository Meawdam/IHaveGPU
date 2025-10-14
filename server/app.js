const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const session = require("express-session");
const mysql = require("mysql2");

env.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

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

app.get("/", (req, res) => {
    res.send(process.env.DB_NAME);
});

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is running");
});