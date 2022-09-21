const express = require("express");
const app = express();
const parser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'MySQL!1996',
    database: 'jctdatabase'
});

app.use(cors());
app.use(express.json());
app.use(parser.urlencoded({extended: true}));

db.connect((err) => {
    if (err)
        console.log(err);
    else
        console.log("Database connected!");
});

app.post("/registration", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    console.log("I am here in registration, holding onto the following: (?,?,?)", username, email, password);

    const query = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
      
    db.query("INSERT INTO Users (username, email, password) VALUES (?,?,?)", [username, email, password],
    (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("User registered.");
    }
    });
});

app.listen(3001, () => {
    console.log("Running on port: 3001");
})