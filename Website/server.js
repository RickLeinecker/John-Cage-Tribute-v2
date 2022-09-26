const express = require('express');
//const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('@postman/form-data');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;
const mongoose = require('mongoose');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const multer = require('multer');
const { response } = require('express');
const Post = require('./models/Post');
const randomstring = require("randomstring");
const wavefile = require('wavefile').WaveFile;
const Lame = require("node-lame").Lame;
const cp = require('child_process');

const baseUrl = 'https://johncagetribute.org';
// const baseUrl = `http://localhost:${PORT}`;

// Connect Database
//connectDB();
// Initialize Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true, parameterLimit: 50000 }));
// The line of code should get commented out when deploying, bring it back if testing on local machine server.
//app.get('/', (req, res) => res.send('API Running...'));
// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/compositions', require('./routes/api/compositions'));
app.use('/api/uploaddownload', require('./routes/api/uploaddownload'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Socket Code
const Role = {
  LISTENER: 0,
  PERFORMER: 1
};

const sampleRate = 22050;
availableRooms = {}; // Currently active rooms
memberAttendance = {}; // Maps socketId to roomId
audioProcessorPool = cp.fork('./audioProcessor/audioProcessorPool.js');

io.on('connection', function (socket) {
  console.log(`Received connection from socket: ${socket.id}.`);

  const rooms = availableRooms;
  socket.emit('updaterooms', rooms);

  // Rooms' ids
  socket.on('createroom', function (data) {
    console.log(`Received createroom from socket: ${socket.id}.`);

    const room = data.room;
    const roomId = room['id'];
    const member = data.member;

    availableRooms[roomId] = room;
    availableRooms[roomId]['isOpen'] = true;
    availableRooms[roomId]['members'] = {};
    availableRooms[roomId]['members'][socket.id] = member;
    availableRooms[roomId]['members'][socket.id]['socket'] = socket.id;
    audioProcessorPool.send({command:'createAudioProcessor', roomId:roomId});
    availableRooms[roomId]['sessionAudio'] = [];

    if (member.role == Role.PERFORMER) {
      audioProcessorPool.send({command:'addPerformer', roomId:roomId, socketId:socket.id});
      availableRooms[roomId]['currentPerformers'] = 1;
      availableRooms[roomId]['currentListeners'] = 0;
    }
    else {
      availableRooms[roomId]['currentPerformers'] = 0;
      availableRooms[roomId]['currentListeners'] = 1;
    }

    memberAttendance[socket.id] = roomId;
    socket.join(roomId);

    io.to(roomId).emit('updatemembers', {
      members: availableRooms[roomId]['members'],
      sessionStarted: null
    });
  });

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
      audioProcessorPool.send({command:'endSession', roomId:roomId});
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
        audioProcessorPool.send({command:'removePerformer', roomId:roomId, socketId:socket.id});
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

  socket.on('verifypin', function (data) {
    console.log(`Received verifypin from socket: ${socket.id}`);

    const { roomId, enteredPin } = data;
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
        audioProcessorPool.send({command:'addPerformer', roomId:roomId, socketId:socket.id});
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
      availableRooms[roomId]['sessionStarted'] = true;
      io.to(roomId).emit('audiostart', null);
      io.emit('updateoneroom', {
        roomId: roomId,
        room: availableRooms[roomId]
      });
    }
  });

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
      audioProcessorPool.send({command:'toggleActive', roomId:roomId, socketId:socket.id});
    }

    availableRooms[roomId]['members'][socket.id]['isActive'] = !isActive;
    console.log(`Socket ${socket.id}'s isActive field: ${!isActive}`);
  });

  // Iterate through members of roomId whose roles are LISTENER
  // Then, pass them the audio data
  socket.on('sendaudio', function (data) {
    const roomId = memberAttendance[socket.id];

    if (!roomId) {
      return;
    }

    // Send the audio from the performer to the audio processor. If the audio processor has
    // enough audio from each performer it will processes and mix the audio. The mixed audio
    // is recived and sent to listeners by the audioProcessorPool.
    audioProcessorPool.send({command:'buffer', roomId:roomId, socketId:socket.id, audioIn:data})

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

  socket.on('endsession', async function (data) {
    console.log(`Received endsession from socket: ${socket.id}.`);

    const { roomId } = data;
    const existingRoom = availableRooms[roomId];

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

    audioProcessorPool.send({command:'endSession', roomId:roomId})

    // Create a WAV file buffer from the raw audio data before we
    // delete the room. This encodes the number of channels, sample rate,
    // and bit depth into the raw data which the MP3 conversion needs
    console.log('Making a wav file!');
    var wav = new wavefile();
    const numberOfSamples = availableRooms[roomId]['sessionAudio'].length;
    wav.fromScratch(1, sampleRate, '16', availableRooms[roomId]['sessionAudio']);
    // Save the WAV file buffer as a raw data buffer
    var audioFileBuffer = Buffer.from(wav.toBuffer());

    console.log('Finished making the wav file');

    delete availableRooms[roomId];

    // Generate a random temporary filename for the MP3
    var mp3FileName = "./audioFiles/" + randomstring.generate() + ".mp3";

    // Create an MP3 encoder with data buffer input and output
    const encoder = new Lame({
      "output": mp3FileName,
      "bitrate": 96
    }).setBuffer(audioFileBuffer);

    // Encode the MP3 file
    await encoder.encode();
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

    console.log('Uploading MP3 to database...')
    // console.log(formData);

    const response = await fetch(`${baseUrl}/api/compositions/upload`, { method: 'POST', body: formData });
    // console.log(response);
    console.log('uploaddownload call complete!');

    // After the MP3 file as been uploaded, delete it from the server 
    // Close the read stream to release the file descriptor 
    mp3FileStream.close()
    fs.unlink(mp3FileName, (err) => {
      if (err) console.log('Error deleting temporary file!');
    });
  });

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
          audioProcessorPool.send({command:'removePerformer', roomId:roomId, socketId:socket.id});
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

  socket.on('updaterooms', function () {
    console.log(`Received updaterooms from socket: ${socket.id}.`);

    const existingRooms = availableRooms;
    socket.emit('updaterooms', existingRooms);
  });
});

// Handle reciving processed audio from performers and send
// to listeners in the same room.
audioProcessorPool.on('message', (data) => {
  if (data.message == 'finishedProcessing') {
    processedAudio = data.processedAudio;
    socketId = data.socketId
    roomId = memberAttendance[socketId];

      if (availableRooms[roomId]) {
      availableRooms[roomId]['sessionAudio'].push.apply(availableRooms[roomId]['sessionAudio'], processedAudio)
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

// Serve static assets in production
// Set static folder (Comment out next 4 lines if running locally)
app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
http.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
