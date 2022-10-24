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
    password: '',
    database: 'jctdatabase'
});

// List Compositions
app.get("/recordings", (req, res) => {
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

// List user's recordings
app.get("/userRec", (req, res) => {
    const s  = 1 // going to switch this to user id that is passed through token
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.title, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date FROM Users U LEFT JOIN UserRecording T ON '%" + s + "%' = T.userId LEFT JOIN Recordings R ON R.recordingId = T.recordingId",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result);
    }
    });
});

// Search Composition by Title, Maestro, or Date
app.get("/title", (req, res) => {
    const s  = req.query.query;
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.title, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = U.id AND ((R.title LIKE '%" + s + "%') OR (U.username LIKE '%" + s + "%') OR (R.recordingDate LIKE '%" + s + "%'))",
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
        res.send(result);
    }
    });
});

// Delete Recording
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db2.query("DELETE FROM Recordings WHERE recordingId = ?", id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

// Create Recording

// Create UserRecording

