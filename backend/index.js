import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import mysql from "mysql2"
dotenv.config();

const app = express();
 
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
 
app.listen(3001, ()=> console.log('Server running at port 3001'));

const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mypassword112',
    database: 'jctdatabase'
});

// List Compositions
app.get("/recordings", (req, res) => {
    console.log("WE MADE IT HERE");
    db2.query("SELECT R.recordingId, R.maestroId, R.title, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = U.id",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result);
    }
    });
});

// List Contests
app.get("/contests", (req, res) => {
      
    db2.query("SELECT * FROM Contests",
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
    db2.query("DELETE FROM Recordings WHERE recordingId = '%" + id + "%'", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

// create recording
app.post("/createRecording", (req, res) => {
    // need to get maestroId, title, date scheduled, incontest
    if (req.date < getCurrentDate()) // will need to change req.date
    {
        res.status(404).send("You must select a future date/time to record");
    }
    // if not maestro send error
    db2.query("INSERT INTO Recordings (maestroId, title, recordingDate, inContest) VALUES (X, title, '%" + req.date + "%', bool);",
    (err, res) => {
    if (err) {
        console.log(err);
    } else {
        res.send(result);
    }
    });
});

// update recording
