// This file is run as a child process from server.js.
// It maintains a map of audio processors for each active 
// room and routes all incoming commands and data from the 
// server socket code to the audio processor for that room.
// Audio data recived from the audio processors is sent back
// to server.js along with the roomId.

import cp from 'child_process';

console.log('AudioProcessorPool running...');
var audioProcessors = {}; // Currently active audio processors

// We got a message from the server, handle the messages
// based on the 'command' member of the data object
process.on('message', (data) => {
    // Create a new audio processor in a seperate thread
    if (data.command == 'createAudioProcessor') {
        audioProcessors[data.roomId] = cp.fork('./audioProcessor/audioProcessorRunner.js');
        // If the audio processor sent data back, 
        // pass it back to the server
        audioProcessors[data.roomId].on('message', (data) => {
            if (data.message == 'finishedProcessing') {
                process.send({message: 'finishedProcessing', processedAudio: data.processedAudio, socketId: data.socketId});
            }
            else if (data.message == 'addSilence') {
                process.send({message: 'addSilence', numSamples: data.numSamples, socketId: data.socketId});
            }
        })
    }
    // Add a new performer to the audio processor for roomId
    else if (data.command == 'addPerformer') {
        audioProcessors[data.roomId].send({command: 'addPerformer', socketId: data.socketId});
    }
    // Remove a performer from the audio processsor for roomId
    else if (data.command == 'removePerformer') {
        audioProcessors[data.roomId].send({command: 'removePerformer', socketId: data.socketId});
    }

    else if (data.command == 'toggleActive') {
        audioProcessors[data.roomId].send({command: 'toggleActive', socketId: data.socketId});
    }
    // Send the audio data from a performer to the 
    // audio processor for roomId to be processed
    else if (data.command == 'buffer') {
        audioProcessors[data.roomId].send({command: 'buffer', socketId: data.socketId, audioIn: data.audioIn});
    }
    // Kill the audio processor thread and remove it from the map
    else if (data.command == 'endSession') {
        audioProcessors[data.roomId].kill();
        delete audioProcessors[data.roomId];
    }
});