import AudioContext from '@descript/web-audio-js';
import Tuna from 'tunajs'

export default class AudioProcessor {

    constructor() {
        console.log('Creating an audio processer')
        // The number of performers for this session
        this.numActivePerformers = 0;

        // A map of performers and their atributes
        this.performers = {};

        // The size of the processing audio block.  Start with an arbitarily large
        // value here that gets resized based on the audio input in buffer()
        this.blockSize = 100000;

        this.sampleRate = 22050;

        this.noneActiveStartTime = 0;

        // The audio context interface to Web Audio API
        this.audioContext = new AudioContext.RawDataAudioContext({sampleRate:this.sampleRate, blockSize:128, numberOfChannels:1});

        // The audio effect generator (we're not using this... yet...)
        this.tuna = new Tuna(this.audioContext);

        // Some examples of audio effects created using tuna
        /*
        this.chorus = new this.tuna.Chorus({
            rate: 1.5,         //0.01 to 8+
            feedback: 0.2,     //0 to 1+
            delay: 0.0045,     //0 to 1
            bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
        });

        this.overdrive = new this.tuna.Overdrive({
            outputGain: 0,           //-42 to 0 in dB
            drive: 1,                //0 to 1
            curveAmount: 0.725,      //0 to 1
            algorithmIndex: 0,       //0 to 5, selects one of the drive algorithms
            bypass: 0
        });

        this.filter = new this.tuna.Filter({
            frequency: 800,         //20 to 22050
            Q: 1,                   //0.001 to 100
            gain: 0,                //-40 to 40 (in decibels)
            filterType: "lowpass",  //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
            bypass: 0
        });

        this.delay = new this.tuna.Delay({
            feedback: 0.45,    //0 to 1+
            delayTime: 100,    //1 to 10000 milliseconds
            wetLevel: 0.5,     //0 to 1+
            dryLevel: 1,       //0 to 1+
            cutoff: 20000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
            bypass: 0
        });

        this.overdrive.connect(this.audioContext.destination)
        
        this.bitcrusher.connect(this.audioContext.destination)
        this.moog.connect(this.bitcrusher)
        this.chorus.connect(this.moog)

        this.chorus.connect(this.audioContext.destination)
        
        this.delay.connect(this.filter)
        this.filter.connect(this.audioContext.destination)

        */
    }

    // This function adds a new performer to the recording session.
    addPerformer(performerID) {
        console.log(`I should be adding performer ID: ${performerID}`);
        
        // Increase the total number of performers by 1
        this.numActivePerformers += 1;

        // Add the ID of the performer to the list of performers
        this.performers[performerID] = {};

        // Add a new empty array to the audio input buffer
        this.performers[performerID]['audioInBuffer'] = [];

        this.performers[performerID]['isActive'] = true;

        console.log('Added ' + performerID + ' to the audio processor performers.  Now there are ' + this.numActivePerformers + ' performers');
    }

    // This function removes a performer from the recording session.
    removePerformer(performerID) {
        // Look up the performer by socket ID
        if (!this.performers[performerID]) {
            console.log('Cannot find a performer with socketID ' + performerID + ' to remove from audio processor')
            return
        }

        // Decrease the total number of active performers by 1
        if (this.performers[performerID]['isActive']) {
            this.numActivePerformers -= 1;
        }

        // Remove the performer from the performer map
        delete this.performers[performerID];

        // Reset the blockSize in case this performer had the smallest audio chunk size
        this.blockSize = 100000;

        console.log('Removed ' + performerID + ' from the audio processor performers.  Now there are ' + this.numActivePerformers + ' performers')
    }

    toggleActive(performerID) {
        if (!this.performers[performerID]) {
            console.log('Cannot find a performer with socketID ' + performerID + ' in toggleActive')
            return null;
        }

        // Toggle the isActive flag on the performer based on the current state
        // and update the total number of active performers
        if (this.performers[performerID]['isActive']) {
            this.performers[performerID]['isActive'] = false;
            this.numActivePerformers -= 1;

            // If no performers are left active, save the current time
            if (this.numActivePerformers == 0) {
                this.noneActiveStartTime = Date.now();
                console.log('All performers are inactive! Time is ' + this.noneActiveStartTime);
            }
        } else {
            this.performers[performerID]['isActive'] = true;
            this.numActivePerformers += 1;

            // If a performer is becoming active after all performers were
            // inactive, calculate and return the amount of samples that
            // should have passed in that time
            if (this.numActivePerformers == 1) {
                var currentTime = Date.now();
                var timeElapsed = currentTime - this.noneActiveStartTime;

                console.log('Performer is active after all were inactive, time elapsed is ' + timeElapsed);
                return (Math.round((timeElapsed / 1000) * this.sampleRate));
            }
        }
        return null;
    }

    // This function takes the socket ID of a performer and recorded audio data,
    // adds the raw audio to the buffer for the performer specified by the socket ID,
    // and if there is enough audio data, mixes and returns the mixed audio.
    buffer(performerID, audioIn) {
        console.log("Performers:");
        console.log(this.performers);
        if (!this.performers[performerID]) {
            console.log('buffer() cannot find a performer with socketID ' + performerID)
            return
        }

        // Make sure the bockSize for the session is the smallest audio chunk size from any of the performers.
        if (audioIn.length < this.blockSize) {
            console.log('New blocksize of ' + audioIn.length);
            this.blockSize = audioIn.length;
        }

        // Add the audio to the buffer
        this.performers[performerID]['audioInBuffer'] = this.performers[performerID]['audioInBuffer'].concat(audioIn);

        // If the input buffer is ready for processing, process it
        if (this.isBufferReadyToProcess()) {
            return this.process()
        } else {
            return null;
        }
    }

    // This function processes all the raw audio data from the input buffers through
    // the audio graph specified by the audio context.  If the buffer does not
    // have enought audio to be processed, return null.  If the audio was processed
    // sucessfully, return the processed amd mixed audio data
    process() {
        // The processed audio data to be returned
        var processedAudio = []

        // Create audio source nodes for each performer's input buffer
        var audioSourceNodes = []
        for (var performer in this.performers) {
            // Create source buffers and fill them with audio data
            var buffer = this.audioContext.createBuffer(1, this.blockSize, this.sampleRate)
            var bufferData = buffer.getChannelData()
            for (var j = 0; j < this.blockSize; j++) {
                bufferData[j] = this.performers[performer]['audioInBuffer'].shift()
            }
            
            // Create audio source nodes from the source buffers
            audioSourceNodes[i] = this.audioContext.createBufferSource()
            audioSourceNodes[i].buffer = buffer

            // Start the audio source node so data can be read from it
            audioSourceNodes[i].start()

            // Connect the source nodes to the context destination node
            // so audio data can be read after it is processed
            // By connecting all the sources to the 1 destination node,
            // the audio data is automatically mixed together
            audioSourceNodes[i].connect(this.audioContext.destination)
        }

        // Make sure the audio context is ready to process the audio
        this.audioContext._impl.resume()

        // Process audio through the audio graph 1 block at a time
        for (var i = 0; i < this.blockSize; i += this.audioContext.blockSize) {
            // Create an empty block for data to be written into
            var blockData = [new Float32Array(this.audioContext.blockSize)]

            // Process 1 block of audio through the audio graph and 
            // save it into blockData
            this.audioContext.process(blockData);

            // Push the processed audio block into the list to be returned
            processedAudio.push.apply(processedAudio, blockData[0])
        }

        // Reset the audio context to avoid weird timing errors
        this.audioContext._impl.suspend()
        this.audioContext._impl._sched = {}
        this.audioContext._impl.currentTime = 0
        this.audioContext._impl.currentSampleFrame = 0
        
        // Finally, return the processed audio to be sent to listeners
        return processedAudio
    }

    // This function will only return true if we have at least blockSize amount of
    // audio data in the input buffer for each performer
    isBufferReadyToProcess() {
        // Find the smallest performer buffer
        var min = this.blockSize;
        for (var performer in this.performers) {
            if (this.performers[performer]['isActive'] && this.performers[performer]['audioInBuffer'].length < min) {
                min = this.performers[performer]['audioInBuffer'].length
            }
        }

        if (min < this.blockSize) {
            return false
        } else {
            return true
        }
    }
}

// module.exports = AudioProcessor
