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
    const s  = req.query.id; // going to switch this to user id that is passed through token
    console.log("req: !!", s);
    console.log("req.id", req);
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.title, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date FROM Users U LEFT JOIN UserRecording T ON '" + s + "' = T.Userid LEFT JOIN Recordings R ON R.recordingId = T.recordingId",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("SUCCESS USER RES", result);
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
    db2.query("DELETE FROM Recordings WHERE recordingId = '" + id + "'", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

// Create Recording

// Create UserRecording
// create schedule
app.post("/schedule", (req, res) => {
    const s  = req.query.id;
    const datex = new Date();
    // need to get date scheduled, title, description, id
    console.log("WE ARE HERE IN SCHEDULE :P");
    if (req.date < datex) // will need to change req.date
    {
        res.status(404).send("You must select a future date/time to record");
    }
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charLength = chars.length;
    var passListen = '';
    var passPerform = '';
    for ( var i = 0; i < 12; i++ ) {
       passListen += chars.charAt(Math.floor(Math.random() * charLength));
       passPerform += chars.charAt(Math.floor(Math.random() * charLength));
    }
    console.log("PassListen is ", passListen);
    // CHECK if not maestro send error
    // CHECK if date already exists
    db2.query("SELECT DISTINCT S.maestroId, S.userOne, S.userTwo, S.userThree, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y') AS date, S.title, S.description FROM Schedule S WHERE S.scheduleDate = '" + req.date + "'", (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Row Count is ", result.length);
        }
        if (result.length == 0)
        {
            db2.query("INSERT INTO Schedule (maestroId, scheduleDate, title, description, passcodeListen, passcodePerform) VALUES ('" + s + "', '" + req.date + "',  '" + req.title + "', '" + req.description + "', '" + passListen + "', '" +  passPerform + "')",
            (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Schedule created");
            }
            });
        }
    })

});

// Enter users into already created schedule table
app.post("/enterSchedule", (req, res) => {
    // get passcode entered, get user Id
    const s  = req.query.id;
    const p = req.query.passcode;
    // CHECK If userOne is not -1, userTwo is not -1, userThree is not -1
    db2.query("SELECT S.maestroId, S.userOne, S.userTwo, S.userThree, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y') AS date, S.title, S.description FROM Schedule S WHERE (S.passcodePerform = '" + p + "') AND (S.userOne == -1)", (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Row Count is ", result.length);
        }
        if (result.length != 0)
        {
            db2.query("UPDATE Schedule SET Schedule.userOne = '" + s + "' WHERE Schedule.passcodePerform = '" + p + "'",
            (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
            });
            return;
        }
    })
    db2.query("SELECT S.maestroId, S.userOne, S.userTwo, S.userThree, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y') AS date, S.title, S.description FROM Schedule S WHERE (S.passcodePerform = '" + p + "') AND (S.userTwo = -2)", (err, result) => {
        if (err) {
          console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
        if (result.length != 0)
        {
            db2.query("UPDATE Schedule SET Schedule.userTwo = '" + s + "' WHERE Schedule.passcodePerform = '" + p + "'",
            (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
            });
            return;
        }
    })
    db2.query("SELECT S.maestroId, S.userOne, S.userTwo, S.userThree, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y') AS date, S.title, S.description FROM Schedule S WHERE (S.passcodePerform = '" + p + "') AND (S.userThree = -3)", (err, result) => {
        if (err) {
          console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
        if (result.length != 0)
        {
            db2.query("UPDATE Schedule SET Schedule.userThree = '" + s + "' WHERE Schedule.passcodePerform = '" + p + "'",
            (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
            });
            return;
        }
    })
});

// List user's scheduled recordings
app.get("/userScheduled", (req, res) => {
    const s  = req.query.id; // going to switch this to user id that is passed through token
    db2.query("SELECT DISTINCT S.maestroId, S.userOne, S.userTwo, S.userThree, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y') AS date, S.title, S.description FROM Schedule S WHERE ('" + s + "' = S.maestroId) OR ('" + s + "' = S.userOne) OR ('" + s + "' = S.userTwo) OR ('" + s + "' = S.userThree)",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("SUCCESS USER event RES", result);
        console.log(result);
        res.send(result);
    }
    });
});

// update recording

