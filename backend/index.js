import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import mysql from "mysql2"
import socket from "socket.io";
import path from "path";
import Users from "./models/User.js";
import childProcess from "child_process";
import fs from "fs";
import * as url from 'url';
import randomstring from 'randomstring';
import pkg2 from 'node-lame';
import fetch from 'node-fetch';
import { createServer } from "http";
import bcrypt from "bcrypt";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import { Blob } from "buffer";
import Axios from "axios";

import wavpkg from 'wavefile';
import FormData from '@postman/form-data';
import { info } from "console";
import e from "express";

const {WaveFile} = wavpkg;
const {Lame} = pkg2;

dotenv.config();

const backendPort = 3001;
const socketPort = 8080;

const app = express();

availableRooms = {};
memberAttendance = {};
audioProcessorPool = childProcess.fork("../Website/audioProcessor/audioProcessorPool.js");

app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(backendPort, ()=> console.log(`Server running at port ${backendPort}`));

const http = createServer(app);
http.listen(socketPort, () => console.log(`Websocket server started on port ${socketPort}`));

const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySQL!1996',
    database: 'jctdatabase'
});

// email confirmation api
app.get('/confirmation/:token', async (req, res) => {
    try {
        const { user: { id } } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
        await Users.update({ confirmed: true}, { where: { id }});
    }   catch (e) {
        console.log("THERE HAS BEEN SUM ERROR");
        res.send('error');
    }
    return res.redirect('http://localhost:3000/login');
});

// Recording API Calls
// -----------------------------------------------------------------------------------
// List Compositions
app.get("/recordings", (req, res) => {
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.description, R.title, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = U.id",
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
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.description, R.title, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Users U LEFT JOIN UserRecording T ON '" + s + "' = T.Userid LEFT JOIN Recordings R ON R.recordingId = T.recordingId WHERE U.id = R.maestroId",
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
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.title, R.description, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = U.id AND ((R.title LIKE '%" + s + "%') OR (U.username LIKE '%" + s + "%') OR (R.recordingDate LIKE '%" + s + "%'))",
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
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Listing All Contests");
        res.send(result);
    }
    });
});

// Delete Recording
app.delete("/deleterecording", (req, res) => {
    const id = req.query.id; // need new description, userId, recordingId trying to edit
    db2.query("DELETE FROM Recordings R WHERE R.recordingId = '" + id + "'", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });

    // CHECK if not maestro send error
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.title, R.description, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = '" + s +"' AND R.recordingId = '" + req.query.recordingid + "'", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
        if (result.length == 1)
        {
            db2.query("DELETE FROM Recordings R WHERE R.recordingId = '" + id + "'", (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Row Count is ", result.length);
                }
            })
        }
    })
});

// Edit Comp description
app.post("/editrecording", (req, res) => {
    console.log("CALL EDIT RECORDING DESC")
    const s  = JSON.parse(req.body.params);

//    const parsed = JSON.parse(s[0]);
  //  const pind = s[0];
    // need new description, userId, recordingId trying to edit


    // CHECK if not maestro send error
    db2.query("SELECT DISTINCT R.recordingId, R.description FROM Recordings R WHERE (R.maestroId = '" + s.id +"') AND (R.recordingId = '" + s.recordingid + "')", (err, result) => {
        if (err) {
            console.log("EDIT ERROR");
          console.log(err)
        } else {
          console.log("Row Count is ", result.length);
        }
        if (result.length == 1)
        {
            const newDescription = s.newdescription.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
            const newTitle = s.newtitle.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
            db2.query("UPDATE Recordings SET description = '" + newDescription + "' , " + "title = '" + newTitle + "' WHERE recordingId = '" + s.recordingid + "'", (err, result) => {
                if (err) {
                console.log("EDIT ERROR");
                  console.log(err)
                } else {
                  console.log("Updating and Row Count is ", result.length);
                }
                res.send(result);
            })
        } else
        {
            console.log('Not updating row count not 1');
        }
    })
});

// Edit Comp title
app.post("/edittitle", (req, res) => {
    const s  = req.query.id; // need new description, userId, recordingId trying to edit

    // CHECK if not maestro send error
    db2.query("SELECT DISTINCT R.recordingId, R.maestroId, R.title, R.description, R.lengthSeconds, R.audioFile, R.inContest, DATE_FORMAT(R.recordingDate, '%M-%d-%Y') AS date, U.username FROM Recordings R, Users U WHERE R.maestroId = '" + s +"' AND R.recordingId = '" + req.query.recordingid + "'", (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Row Count is ", result.length);
        }
        if (result.length == 1)
        {
          const newTitle = req.query.newtitle.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
            db2.query("UPDATE Recordings SET title = '" + newTitle + "' WHERE recordingId = '" + req.query.recordingid + "'", (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log("Row Count is ", result.length);
                }
            })
        }
    })
});

// Create Recording and UserRecording
app.post("/createRecording", (req, res) => {
    console.log("In createRecording");
    console.log(req.body);
    console.log(req.query);

    const audioFile = req.body.audioname; // variables passed in
    const passcode = req.body.passcode;
    const length = req.body.length;
    const maestro = req.body.maestroId;
    const userone = req.body.user1;
    const usertwo = req.body.user2;
    const userthree = req.body.user3;

    // get information for recording from schedule
    db2.query("SELECT S.maestroId, S.userOne, S.userTwo, S.userThree, S.scheduleDate, S.title, S.description FROM Schedule S WHERE passcodePerform ='" + passcode + "'",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);

        const title = result[0].title;
        const desc = result[0].description;
        const date = new Date(result[0].scheduleDate).toISOString().replace('T', ' ').replace('Z', '');

        // console.log(date.toDateString());
        // console.log(date.toISOString());
        // console.log(date.toJSON());
        // console.log(date.toLocaleDateString());
        // console.log(date.toLocaleString);
        // console.log(date.toLocaleTimeString);

        const newTitle = title.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');;
        const newDesc = desc.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');

        db2.query("INSERT INTO Recordings(maestroId, title, description, lengthSeconds, audioFile, recordingDate, inContest) VALUES ('" + maestro + "', '" + newTitle + "', '" + newDesc + "', '" + length + "', '" + audioFile + "', '" + date + "', 0)",
        (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Recording created");
        }
        });

        console.log("SELECT R.recordingId FROM Recordings R WHERE (audioFile = '" + audioFile + "')");

        // get RecordingId of recording we just created
        db2.query("SELECT R.recordingId FROM Recordings R WHERE (audioFile = '" + audioFile + "')",
        (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log("In API call...");
            console.log(res);
            const recId = res[0].recordingId;

            // insert maestro
            db2.query("INSERT INTO UserRecording(RecordingId, userId) VALUES ('" + recId + "', '" + maestro + "')",
            (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log("UserRecording created maestro");
            }
            });

            if (userone > 0)
            {
                db2.query("INSERT INTO UserRecording(RecordingId, userId) VALUES ('" + recId + "', '" + userone + "')",
                (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("UserRecording created userone");
                }
                });
            }

            if (usertwo > 0)
            {
                db2.query("INSERT INTO UserRecording(RecordingId, userId) VALUES ('" + recId + "', '" + usertwo + "')",
                (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("UserRecording created usertwo");
                }
                });
            }

            if (userthree > 0)
            {
                db2.query("INSERT INTO UserRecording(RecordingId, userId) VALUES ('" + recId + "', '" + userthree + "')",
                (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("UserRecording created userthree");
                }
                });
            }
        }
        });

    }
    });

    // delete schedule table
    db2.query("DELETE FROM Schedule WHERE passcodePerform = '" + passcode + "'",
    (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("UserRecording created userthree");
    }
    });
});

// Playback previous recordings
// get the audio file

// Schedule API Calls
// -----------------------------------------------------------------------------------
// create schedule
app.post("/schedule", (req, res) => {
    const s  = JSON.parse(req.body.params);
    console.log("S IS HERE:");
    console.log(s);
    console.log("date is", s.date);
    const datex = new Date();
    // need to get date scheduled, title, description, id
    console.log("WE ARE HERE IN SCHEDULE :P");
    if (s.date < datex) // will need to change req.date
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
    db2.query("SELECT DISTINCT S.maestroId, S.userOne, S.userTwo, S.userThree, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y %H-%i') AS date, S.title, S.description FROM Schedule S WHERE S.scheduleDate = '" + s.date + "'", (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Row Count is ", result.length);
          console.log(result);
        }
        if (result.length == 0)
        {
            db2.query("INSERT INTO Schedule (maestroId, title, description, scheduleDate, passcodeListen, passcodePerform) VALUES ('" + s.id + "', '" + s.title + "', '" + s.desc + "', '" + s.date + "', '" + passListen + "', '" +  passPerform + "')",
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
    console.log("enter sched params")
    const s  = JSON.parse(req.body.params);
    console.log(s);
    const i  = s.id;
    const p = s.passcode;

    // CHECK If userOne is not -1, userTwo is not -1, userThree is not -1
    db2.query("SELECT S.maestroId FROM Schedule S WHERE (S.passcodePerform = '" + p + "') AND (S.userOne = -1)", (err, result) => {
        if (err) {
          console.log(err)
          return;
        } else {
          console.log("Row Count is ", result.length);
        }
        if (result.length != 0)
        {
            db2.query("UPDATE Schedule SET Schedule.userOne = '" + i + "' WHERE Schedule.passcodePerform = '" + p + "'",
            (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send("user input into event");
            }
            });
        }   else {
            db2.query("SELECT S.maestroId FROM Schedule S WHERE (S.passcodePerform = '" + p + "') AND (S.userTwo = -2)", (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                    console.log("Row Count is ", result.length);
                }
                if (result.length != 0)
                {
                    db2.query("UPDATE Schedule SET Schedule.userTwo = '" + i + "' WHERE Schedule.passcodePerform = '" + p + "'",
                    (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("user input into event");
                    }
                    });
                } else {
                    db2.query("SELECT S.maestroId FROM Schedule S WHERE (S.passcodePerform = '" + p + "') AND (S.userThree = -3)", (err, result) => {
                        if (err) {
                          console.log(err)
                        } else {
                            console.log("Row Count is ", result.length);
                        }
                        if (result.length != 0)
                        {
                            db2.query("UPDATE Schedule SET Schedule.userThree = '" + i + "' WHERE Schedule.passcodePerform = '" + p + "'",
                            (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send("user input into event");
                            }
                            });
                            return;
                        }
                    })
                }
            })
        }
    })

});

// List user's scheduled recordings
app.get("/userScheduled", (req, res) => {
    const s  = req.query.id;
    db2.query("SELECT DISTINCT S.maestroId, S.userOne, S.userTwo, S.userThree, S.passcodePerform, S.passcodeListen, DATE_FORMAT(S.scheduleDate, '%M-%d-%Y %H:%i') AS date, S.title, S.description FROM Schedule S WHERE ('" + s + "' = S.maestroId) OR ('" + s + "' = S.userOne) OR ('" + s + "' = S.userTwo) OR ('" + s + "' = S.userThree)",
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

// List user's scheduled recordings
app.get("/username", (req, res) => {
    const s  = req.query.id;
    db2.query("SELECT DISTINCT U.username FROM Users U WHERE id = '" + s + "'",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result);
    }
    });
});

// REQUEST/APPROVAL maestro accounts api calls
// -------------------------------------------------------------------------------
// 	List all users who are requested to become maestro
app.get("/listrequested", (req, res) => {
    db2.query("SELECT DISTINCT U.id, U.username, U.email, U.bio, U.isRequested FROM Users U WHERE U.isRequested = 1",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result);
    }
    });
});

//  Change isrequested to 1
app.post("/changerequested", (req, res) => {
    const s  = req.body.id; // need new description, userId, recordingId trying to edit
    db2.query("UPDATE Users SET isRequested = 1 WHERE id = '" + s + "'", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
    });

});

// api call to change ismaestro to 1
app.post("/changeismaestro", (req, res) => {
    const s  = req.body.id; // need new description, userId, recordingId trying to edit
    console.log("WE MADE IT");
    console.log(req.body);

    db2.query("UPDATE Users SET isMaestro = 1 WHERE id = '" + s + "'", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
    });
});

// api call to change isRequested to 0 (Rejected)
app.post("/changeisrequested", (req, res) => {
    const s  = req.body.id; // need new description, userId, recordingId trying to edit

    db2.query("UPDATE Users SET isRequested = 0 WHERE id = '" + s + "'", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
    });
});

// list all users for admin
app.get("/listusers", (req, res) => {
    db2.query("SELECT U.id, U.username, U.email, U.bio, U.isMaestro from Users U WHERE id > 0",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result);
    }
    });
});

// delete user for admin
app.post("/deleteuser", (req, res) => {
    console.log("DELETING USER");
    const id = req.body.id// need ID
    db2.query("DELETE FROM Users WHERE id = '" + id + "'",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send("user deleted");
    }
    });
});

// delete recording
app.post("/deleterecordingadmin", (req, res) => {
    console.log("In admin delete thing:");
    console.log(req.body.data.id);
    const id = req.body.data.id; // need id
    db2.query("DELETE FROM Recordings R WHERE R.recordingId = '" + id + "'", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("recording deleted");
      }
    });
});

// APIS for User Profile
// -------------------------------------------------------------------------------
// get user info
app.get("/userinfo", (req, res) => {
    const s  = req.query.id;
    console.log("WE ARE HERE");
    db2.query("SELECT DISTINCT U.username, U.email, U.isMaestro, U.bio, U.isRequested FROM Users U WHERE id = '" + s + "'",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result);
    }
    });
});

// edit bio
app.post("/editbio", (req, res) => {
    const s  = req.body.id; // need new description, userId, recordingId trying to edit

    const newBio = req.body.newbio.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');

    db2.query("UPDATE Users SET bio = '" + newBio + "' WHERE id = '" + s + "'", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
    })

});

// edit username
app.post("/editusername", (req, res) => {
    const s  = req.body.id; // need new description, userId, recordingId trying to edit
    const newName = req.body.newbio.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');

    db2.query("UPDATE Users SET username = '" + newName + "' WHERE id = '" + s + "'", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Row Count is ", result.length);
        }
    })

});

// Check Listen Code
app.get("/listeninput", (req, res) => {
    const s = req.query.passListen;
    db2.query("SELECT DISTINCT S.maestroId FROM S WHERE passcodeListen = '" + s + "'",
    (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        res.send(result.length);
    }
    });
})

// This is here at the bottom to not interfere
// with any of the above API calls!!
// Serving out files to the server
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace("/backend", "/Website");
console.log(__dirname + "client/build");

console.log(__dirname + "audioFiles");

app.use(express.static(__dirname + "client/build"));
app.use('/audio', express.static(__dirname + "audioFiles"));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Socket.IO Code
// A lot of which is reused from old code but there are new functionalities added
const io = socket(http);

const Role = {
    LISTENER: 0,
    PERFORMER: 1
};

const sampleRate = 44100;
var availableRooms = {}; // Currently active rooms
var memberAttendance = {}; // Maps socketId to roomId
var audioProcessorPool = childProcess.fork('../Website/audioProcessor/audioProcessorPool.js');

io.on("connection", function (socket) {
    // Register from mobile app
    socket.on("register", async (credentials) => {
        console.log("Registering!!!");

        await Axios.post('http://localhost:3001/users', {
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
            confPassword: credentials.passwordconfirm
        }).then((response) => {
            console.log(response);
            socket.emit("regsuccess", response.data);
          }, (error) => {
            console.log(error);
            socket.emit("regerror", error.response.data);
          });
    });

    // Log in from mobile app
    socket.on("login", async (credentials) => {
        await Axios.post('http://localhost:3001/login/', {
          email: credentials.email,
          password: credentials.password
         }).then((response) => {
            console.log(response);
            socket.emit("loginsuccess", response.data);
          }, (error) => {
            console.log(error);
            socket.emit("loginerror", error.response.data);
          });
    });

    // Joining a concert
    socket.on("standby", (stream) => {
        console.log("We have a contributor on standby!");

        // TODO: Authenticate that the user is both logged in AND
        // they are a contributor registered to the concert

    });


    // Reusing old code
    // This sends a list of available rooms to the app/website
    const rooms = availableRooms;
    socket.emit('updaterooms', rooms);

    // Rooms' ids
    // UPDATED
    socket.on('createroom', function (data) {
        // Run checks to make sure the user is the maestro AND they're opening on their scheduled timeframe
        db2.query("SELECT * FROM Schedule ORDER BY scheduleDate ASC;", (err, result) => {
            if (err)
            {
                console.log(err);
                socket.emit("scheduleerror", "You don't have any concerts scheduled. Why don't you schedule at our website?");
                return;
            } else
            {
                // Empty table check
                if (result[0] == undefined)
                {
                    socket.emit("scheduleerror", "You don't have any concerts scheduled. Why don't you schedule at our website?");
                    return;
                }

                // Maestro check
                if (data.member.userId != result[0].maestroId)
                {
                    console.log(result[0].maestroId);
                    socket.emit("scheduleerror", "You don't have a concert scheduled for this time frame.");
                    return;
                }



                const currDate = new Date();
                const offset = currDate.getTimezoneOffset();

                const scheduleStart = new Date(result[0].scheduleDate - (offset * 60000));
                const scheduleEnd = new Date(result[0].scheduleDate.getTime() + 20*60000 - (offset * 60000));

                console.log(result[0].scheduleDate);
                console.log(`Start: ${scheduleStart}`);
                console.log(`End: ${scheduleEnd}`);
                console.log(`Currently: ${currDate}`);

                // Timeframe check
                if (scheduleStart > currDate || currDate > scheduleEnd)
                {
                    socket.emit("scheduleerror", "You don't have a concert scheduled for this time frame.");
                    return;
                }

                const room = data.room;
                const roomId = room['id'];
                const member = data.member;

                availableRooms[roomId] = room;
                availableRooms[roomId]['isOpen'] = true;
                availableRooms[roomId]['members'] = {};
                availableRooms[roomId]['members'][socket.id] = member;
                availableRooms[roomId]['members'][socket.id]['socket'] = socket.id;
                audioProcessorPool.send({ command: 'createAudioProcessor', roomId: roomId });
                availableRooms[roomId]['sessionAudio'] = [];
                availableRooms[roomId]['scheduleID'] = result[0].passcodePerform;
                availableRooms[roomId]['maestro'] = result[0].maestroId;
                availableRooms[roomId]['endtime'] = scheduleEnd;
                availableRooms[roomId]['timeoutID'] = undefined;

                console.log(`Ending at ${availableRooms[roomId]['endtime']}`);

                console.log("Printing member...");
                console.log(availableRooms[roomId]['members'][socket.id]);
                console.log("Member printed...");

                //console.log(availableRooms[roomId].scheduleID);

                if (member.role == Role.PERFORMER) {
                    audioProcessorPool.send({ command: 'addPerformer', roomId: roomId, socketId: socket.id });
                    console.log("I'm in INDEX, addPerformer");
                    availableRooms[roomId]['currentPerformers'] = 1;
                    availableRooms[roomId]['currentListeners'] = 0;
                }
                else {
                    availableRooms[roomId]['currentPerformers'] = 0;
                    availableRooms[roomId]['currentListeners'] = 1;
                }

                memberAttendance[socket.id] = roomId;
                socket.join(roomId);

                console.log(roomId);

                socket.emit("schedulesuccess", "You did it!");

                console.log(availableRooms);

                io.to(roomId).emit('updatemembers', {
                    members: availableRooms[roomId]['members'],
                    sessionStarted: null
                });
            }
        });
    });

    // UPDATED
    socket.on('leaveroom', function (roomId) {
        const existingRoom = availableRooms[roomId];

        if (!existingRoom) {
            console.log(`Room of ID ${roomId} does not exist.`);
            return;
        }

        const memberList = existingRoom['members'];

        if (!memberList) {
            io.to(roomId).emit(
                'roomerror',
                "This room's member data is missing. Please exit."
            );
            return;
        }

        const user = memberList[socket.id];

        if (!user) {
            return;
        }

        // If the host is leaving, clear the room
        if (user['isHost']) {
            console.log('Host is leaving.');
            audioProcessorPool.send({ command: 'endSession', roomId: roomId });
            delete availableRooms[roomId];

            io.of('/')
                .in(roomId)
                .clients((error, socketIds) => {
                    if (error) throw error;

                    socketIds.forEach((socketId) => {
                        io.sockets.sockets[socketId].emit(
                            'roomerror',
                            `The host has disconnected. Please exit the room.`
                        );

                        delete memberAttendance[socketId];
                        io.sockets.sockets[socketId].leave(roomId);
                    });
                });
            io.emit('updateoneroom', { roomId: roomId, room: null });
        }
        // If non-host is leaving, handle them exclusively
        else {
            console.log('Non-host is leaving.');
            delete memberAttendance[socket.id];
            socket.leave(roomId);

            const member = availableRooms[roomId]['members'][socket.id];

            if (!member) {
                console.log(
                    `(leaveroom) Leaving member\'s data does not exist in room: ${roomId}.`
                );

                return;
            }

            if (member['role'] == Role.LISTENER) {
                console.log("A listener member is leaving.");
                availableRooms[roomId]['currentListeners']--;
            } else {
                console.log("A performer member is leaving.");
                audioProcessorPool.send({ command: 'removePerformer', roomId: roomId, socketId: socket.id });
                availableRooms[roomId]['currentPerformers']--;
            }

            delete availableRooms[roomId]['members'][socket.id];
            io.to(roomId).emit('updatemembers', {
                members: availableRooms[roomId]['members'],
                sessionStarted: availableRooms[roomId]['sessionStarted']
            });
            io.emit('updateoneroom', { roomId: roomId, room: availableRooms[roomId] });
        }
    });

    // UPDATED
    socket.on('verifypin', function (data) {
        console.log(`Received verifypin from socket: ${socket.id}`);

        const { roomId, enteredPin } = data;
        console.log(roomId);
        console.log(enteredPin);

        const room = availableRooms[roomId];

        if (!room) {
            console.log('Attempting to join nonexistent room.');
            socket.emit('pinerror', 'This room is no longer available.');
            return;
        } else {
            if (enteredPin == room['pin']) {
                socket.emit('pinsuccess', null);
                return;
            }
            socket.emit('pinerror', 'The entered PIN is incorrect.');
        }
    });

    // Non-host actions
    // UPDATED
    socket.on('joinroom', function (data) {
        console.log(`Received joinroom from socket: ${socket.id}.`);

        const roomId = data.roomId;
        const member = data.member;

        const room = availableRooms[roomId];
        if (!room) {
            console.log(`(joinroom) Room does not exist.`);
            socket.emit('roomerror', 'This room does not exist.');
            return;
        }

        const roomMembers = room['members'];

        if (!roomMembers) {
            console.log("(joinroom) This room's member data seems to be missing.");
            socket.emit(
                'joinerror',
                "This room's member data seems to be missing. Please exit."
            );
            return;
        } else {
            if (member['role'] == Role.LISTENER) {
                if (
                    availableRooms[roomId]['currentListeners'] ==
                    availableRooms[roomId]['maxListeners']
                ) {
                    socket.emit(
                        'roomerror',
                        "This room's max listener capacity was reached. Please exit."
                    );
                    return;
                }

                availableRooms[roomId]['currentListeners']++;
            } else {
                if (
                    availableRooms[roomId]['currentPerformers'] ==
                    availableRooms[roomId]['maxPerformers']
                ) {
                    console.log('Max performers reached...');
                    socket.emit(
                        'roomerror',
                        "This room's max performer capacity was reached. Please exit."
                    );
                    return;
                }
                // If a valid performer joined the room, add them to the audio processor
                audioProcessorPool.send({ command: 'addPerformer', roomId: roomId, socketId: socket.id });
                availableRooms[roomId]['currentPerformers']++;
            }

            availableRooms[roomId]['members'][socket.id] = member;
            memberAttendance[socket.id] = roomId;

            socket.join(roomId);

            io.to(roomId).emit('updatemembers', {
                members: availableRooms[roomId]['members'],
                sessionStarted: availableRooms[roomId]['sessionStarted']
            });
            io.emit('updateoneroom', { roomId: roomId, room: availableRooms[roomId] });
        }
    });

    // NEXT
    socket.on('startsession', function (roomId) {
        console.log(`Received startsession from socket: ${socket.id}.`);

        const existingRoom = availableRooms[roomId];

        if (!existingRoom) {
            io.to(roomId).emit(
                'roomerror',
                "Non-host is attempting to start session. Functionality is unavailable."
            );
            return;
        }

        const memberList = existingRoom['members'];

        if (!memberList) {
            io.to(roomId).emit('roomerror', "This room's member data is missing.");
            return;
        }

        const user = memberList[socket.id];

        if (!user) {
            return;
        }

        if (user['isHost']) {
            console.log("Yep! You're the host! Time to partyyyy!");

            // Create the expected end time
            // Either 5 minutes from start or at the
            // end of the scheduled time slot,
            // whichever comes first
            const currDate = new Date();
            const endMinutes = currDate.getTime() + (5 * 60000);
            const endLimit = availableRooms[roomId]['endtime'];

            const timeHolder = Math.min(endMinutes, endLimit);
            const endTime = new Date(timeHolder);

            const timeDiff = endTime - currDate;

            console.log(`We should be ending at: ${endTime}`)
            console.log(endTime);

            setTimeout(function () {timeLimitStop(roomId)}, timeDiff);

            availableRooms[roomId]['timeoutID'] = 0;

            // We now have our scheduled endtime, signal everybody to begin
            availableRooms[roomId]['sessionStarted'] = true;
            io.to(roomId).emit('audiostart', "Let's do it.");
            io.emit('updateoneroom', {
                roomId: roomId,
                room: availableRooms[roomId]
            });
        }
    });

    // LATER
    socket.on('muteordeafen', function (data) {
        console.log(`Received muteordeafen from socket: ${socket.id}`);

        const { roomId, isActive } = data;
        const room = availableRooms[roomId];

        // Verify that this doesn't impact session behavior.
        if (!room) {
            console.log(`Room ${roomId} does not exist. Cannot mute/deafen member.`);
            io.to(roomId).emit('roomerror', "This room does not exist. Please exit.");
            return;
        }

        const member = room['members'][socket.id];

        if (!member) {
            console.log(`Socket ${socket.id} is not found in room ${roomId}.`);
            return;
        }

        // If the member is a performer, notify the audioProcessor for their room
        if (member.role == Role.PERFORMER) {
            audioProcessorPool.send({ command: 'toggleActive', roomId: roomId, socketId: socket.id });
        }

        availableRooms[roomId]['members'][socket.id]['isActive'] = !isActive;
        console.log(`Socket ${socket.id}'s isActive field: ${!isActive}`);
    });

    // Iterate through members of roomId whose roles are LISTENER
    // Then, pass them the audio data
    // AFTER STARTSESSION
    socket.on('sendaudio', function (data) {
        const roomId = memberAttendance[socket.id];

        if (!roomId) {
            console.log(roomId);
            console.log("RETURNING!!!1");
            return;
        }

        // Send the audio from the performer to the audio processor. If the audio processor has
        // enough audio from each performer it will processes and mix the audio. The mixed audio
        // is recived and sent to listeners by the audioProcessorPool.
        audioProcessorPool.send({ command: 'buffer', roomId: roomId, socketId: socket.id, audioIn: data })

        // if (processedAudio != null) {
        //   for (var member in availableRooms[roomId]['members']) {
        //     details = availableRooms[roomId]['members'][member];
        //     if (details['role'] == Role.LISTENER && details['isActive']) {
        //       //console.log(`${details['isGuest'] ? '(GUEST)' : details['name']} is a listener!`);
        //       io.to(details['socket']).emit('playaudio', processedAudio);
        //     }
        //   }
        // }
    });

    // CONCURRENT W/ STARTSESSION
    socket.on('endsession', async function (data) {
        console.log(`Received endsession from socket: ${socket.id}.`);

        const roomId = data["roomId"];
        const existingRoom = availableRooms[roomId];

        console.log(roomId);

        if (!existingRoom) {
          io.to(roomId).emit(
            'roomerror',
            'Cannot end session of nonexistent room. Please exit.'
          );

          return;
        }

        io.of('/')
          .in(roomId)
          .clients((error, socketIds) => {
            if (error) throw error;

            socketIds.forEach((socketId) => {
              delete memberAttendance[socketId];
              io.sockets.sockets[socketId].emit(
                'audiostop',
                `This room's session has ended. Please exit.`
              );
              io.sockets.sockets[socketId].leave(roomId);
              io.sockets.sockets[socketId].emit('updaterooms', availableRooms);
            });
          });

        io.emit('updateoneroom', { roomId: roomId, room: null });

        const timeoutID = availableRooms[roomId]['timeoutID'];
        console.log(`Canceling timeout ${timeoutID}`);

        clearTimeout(timeoutID);

        audioProcessorPool.send({command:'endSession', roomId:roomId});

        // Create a WAV file buffer from the raw audio data before we
        // delete the room. This encodes the number of channels, sample rate,
        // and bit depth into the raw data which the MP3 conversion needs
        console.log('Making a wav file!');
        var wav = new WaveFile();
        const numberOfSamples = availableRooms[roomId]['sessionAudio'].length;
        wav.fromScratch(1, sampleRate, '16', availableRooms[roomId]['sessionAudio']);
        // Save the WAV file buffer as a raw data buffer
        var audioFileBuffer = Buffer.from(wav.toBuffer());

        console.log("audioFileBuffer:");
        console.log(audioFileBuffer);

        // console.log("AUDIO BUFFER:");
        // console.log(audioFileBuffer);

        console.log('Finished making the wav file');

        // Generate a random temporary filename for the MP3
        var mp3FileName = randomstring.generate() + ".mp3";
        var mp3OutputDir = "../Website/audioFiles/" + mp3FileName;

        console.log(`Name: ${mp3FileName}`);

        // Create an MP3 encoder with data buffer input and output
        const encoder = new Lame({
          "output": mp3OutputDir,
          "scale": 60,
          "bitrate": 320,
          "quality": 9
        }).setBuffer(audioFileBuffer);

        console.log("H??");
        // Encode the MP3 file
        encoder
            .encode()
            .then(() => {
                console.log(":)");
            })
            .catch((error) => {
                console.log(error);
            });
        console.log('Finished encoding MP3');

        data.composition = {
          time: numberOfSamples / sampleRate,
          ...data.composition
        };

        // Open the MP3 file as a read stream
        var mp3FileStream = fs.createReadStream(mp3FileName);

        // Make API call
        var formData = new FormData();
        // var file = fs.createReadStream(`test2.mp3`);

        // formData.append('file', file);
        formData.append('file', mp3FileStream);
        formData.append('data', JSON.stringify(data)); // Composition metadata here

        // console.log("formData:");
        // console.log(formData);

        console.log('Uploading MP3 to database...');

        //const response = await fetch(`http://localhost:3000/api/compositions/upload`, { method: 'POST', body: formData });
        // console.log(response);

        // Here, we create a payload that
        // contains the information needed to
        // insert the new recording into the database

        console.log("pAYLOAD");
        console.log(payload);

        var payload = {
            audioname: mp3FileName,
            passcode: availableRooms[roomId]['scheduleID'],
            length: data.composition.time,
            maestroId: 0,
            user1: -1,
            user2: -2,
            user3: -3
        }

        // Fetch the maestro, input them into the payload and remove them from the room
        const maestroSocket = Object.keys(availableRooms[roomId]['members'])[0];
        payload.maestroId = availableRooms[roomId]['members'][maestroSocket].userId;

        delete availableRooms[roomId]['members'][maestroSocket];

        var userCount = 0;
        const userRefs = ['user1', 'user2', 'user3'];

        for(var member in availableRooms[roomId]['members'])
        {
            var user = availableRooms[roomId]['members'][member];
            payload[userRefs[userCount]] = user.userId;
            userCount++;
        }

        // Clear up the room
        delete availableRooms[roomId];

        await Axios.post('http://localhost:3001/createRecording/', payload)
        .then((response) => {
            console.log(response);
            socket.emit("loginsuccess", response.data);
          }, (error) => {
            console.log(error);
            socket.emit("loginerror", error.response.data);
          });

        console.log('uploaddownload call complete!');

        // After the MP3 file as been uploaded, delete it from the server
        // Close the read stream to release the file descriptor
        mp3FileStream.close()
        console.log("This worked idk");
        fs.unlink(mp3FileName, (err) => {
          if (err) console.log("??");
        });
      });

    // LATER
    socket.on('disconnect', function () {
        console.log(`Received disconnect from socket: ${socket.id}.`);

        const roomId = memberAttendance[socket.id];

        if (roomId != null) {
            const existingRoom = availableRooms[roomId];

            if (!existingRoom) {
                io.to(roomId).emit(
                    'roomerror',
                    'Room data does not exist. Please exit.'
                );

                return;
            }

            const member = existingRoom['members'][socket.id];

            // Upon a host's disconnection, the room must be removed
            if (member['isHost']) {
                delete availableRooms[roomId];

                io.of('/')
                    .in(roomId)
                    .clients((error, socketIds) => {
                        if (error) throw error;

                        socketIds.forEach((socketId) => {
                            delete memberAttendance[socketId];
                            io.sockets.sockets[socketId].emit(
                                'roomerror',
                                `The host has disconnected. Please exit the room.`
                            );

                            io.sockets.sockets[socketId].leave(roomId);
                            io.sockets.sockets[socketId].emit(
                                'updaterooms',
                                availableRooms
                            );
                        });
                    });

                io.emit('updateoneroom', { roomId: roomId, room: null });
            }

            // When a non-host disconnects, the room and members size is updated
            else {
                const member = existingRoom['members'][socket.id];
                if (!member) {
                    console.log('Member data missing.');
                    return;
                }

                if (member['role'] == Role.LISTENER) {
                    availableRooms[roomId]['currentListeners']--;
                } else {
                    audioProcessorPool.send({ command: 'removePerformer', roomId: roomId, socketId: socket.id });
                    availableRooms[roomId]['currentPerformers']--;
                }

                delete memberAttendance[socket.id];
                delete availableRooms[roomId]['members'][socket.id];
                io.to(roomId).emit(
                    'updatemembers',
                    {
                        members: availableRooms[roomId]['members'],
                        sessionStarted: availableRooms[roomId]['sessionStarted']
                    }
                );
                io.emit('updateoneroom', { roomId: roomId, room: availableRooms[roomId] });
            }
        }
    });

    // ?
    socket.on('updaterooms', function () {
        console.log(`Received updaterooms from socket: ${socket.id}.`);

        const existingRooms = availableRooms;
        socket.emit('updaterooms', existingRooms);
    });
});

// More shameless canibalism of code

// Handle reciving processed audio from performers and send
// to listeners in the same room.
audioProcessorPool.on('message', (data) => {
    if (data.message == 'finishedProcessing') {
        var processedAudio = data.processedAudio;
        var socketId = data.socketId
        var roomId = memberAttendance[socketId];

        if (availableRooms[roomId]) {
            availableRooms[roomId]['sessionAudio'].push.apply(availableRooms[roomId]['sessionAudio'], processedAudio)
            var details;
            for (var member in availableRooms[roomId]['members']) {
                details = availableRooms[roomId]['members'][member];

                if (details['role'] == Role.LISTENER && details['isActive']) {
                    //console.log(`(${details['isGuest'] ? '(GUEST)' : details['name']}) is a listener!`);
                    io.to(details['socket']).emit('playaudio', processedAudio);
                }
            }
        }
    }
    // All the performers in a room were muted, so we need to
    // add 0s to the session audio for that room to represent silence
    else if (data.message == 'addSilence') {
        numSamples = data.numSamples;
        socketId = data.socketId
        roomId = memberAttendance[socketId];

        silence = Array(numSamples).fill(0);
        availableRooms[roomId]['sessionAudio'].push.apply(availableRooms[roomId]['sessionAudio'], silence);
    }
})

// Serves as a callback function for the setTimeout function
// to call once a group's time is over
function timeLimitStop(roomId) {
    console.log("WE'RE DONE! BYEBYE");

    io.of('/')
          .in(roomId)
          .clients((error, socketIds) => {
            if (error) throw error;

            socketIds.forEach((socketId) => {
                console.log(memberAttendance[socketId]);
                delete memberAttendance[socketId];
                io.sockets.sockets[socketId].emit(
                'audiostop',
                `This room's session has ended. Please exit.`
                );
                io.sockets.sockets[socketId].leave(roomId);
                io.sockets.sockets[socketId].emit('updaterooms', availableRooms);
            });
          });
}