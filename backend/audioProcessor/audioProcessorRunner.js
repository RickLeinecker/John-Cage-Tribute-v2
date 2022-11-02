// This file is a child_thread wrapper around the audio processor
// class.  It allows a single audio processor to be created and run
// as a seperate thread from the main server thread.  Incoming commands
// along with data are passed along to the audio processor instance.

import AudioProcessor from './audioProcessor.js';

// The single underlying audio processor instance
var audioProcessor = new AudioProcessor();

// Messages are recived from the parent thread and passed on to the
// audio processor based on the 'command' member of the data object
process.on('message', (data) => {
    // Add a new performer to the audio processor
    if (data.command == 'addPerformer') {
        audioProcessor.addPerformer(data.socketId);
    }
    // Remove a performer from the audio processor
    else if (data.command == 'removePerformer') {
        audioProcessor.removePerformer(data.socketId);
    }
    // Toggle the isActive flag for a performer
    else if(data.command == 'toggleActive') {
        var numSilenceSamples = audioProcessor.toggleActive(data.socketId);
        // If we just made the first performer active after all were inactive,
        // return the number of silence samples to be added to the session audio
        if (numSilenceSamples != null) {
            process.send({message: 'addSilence', numSamples: numSilenceSamples, socketId: data.socketId});
        }
    }
    // Buffer the incoming audio data. If there is enough
    // audio data to process and mix, the mixed audio data is 
    // returned here.  Otherwise, it returns null.
    else if (data.command == 'buffer') {
        var processedAudio = audioProcessor.buffer(data.socketId, data.audioIn);
        if (processedAudio != null) {
            // If processed audio was returned, send it back to the parent thread
            process.send({message: 'finishedProcessing', processedAudio: processedAudio, socketId: data.socketId});
        }
    }
});