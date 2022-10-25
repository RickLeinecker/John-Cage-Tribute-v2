const express = require("express");
const app = express();
const parser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ``,
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

// List Compositions
app.get("/recordings", (req, res) => {
    console.log("WE MADE IT HERE");
    db.query("SELECT R.recordingId, R.maestroId, R.title, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = U.id",
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