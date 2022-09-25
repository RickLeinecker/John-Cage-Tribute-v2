const express = require("express");
const app = express();
const parser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mypassword112',
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

// Register new user
app.post("/registration", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    console.log("I am here in registration, holding onto the following: (?,?,?)", username, email, password);
      
    db.query("INSERT INTO Users (username, email, password) VALUES (?,?,?)", [username, email, password],
    (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("User registered.");
    }
    });
});

// List Compositions
app.get("/recordings", (req, res) => {
      
    db.query("SELECT * FROM Recordings",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Listing All Recordings");
        console.log(result);
        res.send(result);
    }
    });
});

// List Contests
app.get("/contests", (req, res) => {
      
    db.query("SELECT * FROM Contests",
    (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Listing All Contests");
    }
    });
});

// Delete Recording
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM Recordings WHERE recordingId = ?", id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

app.listen(3001, () => {
    console.log("Running on port: 3001");
})