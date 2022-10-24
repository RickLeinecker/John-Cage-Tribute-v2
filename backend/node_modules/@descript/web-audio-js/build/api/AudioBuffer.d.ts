export default AudioBuffer;
declare class AudioBuffer {
    constructor(opts: any);
    get sampleRate(): any;
    get length(): any;
    get duration(): any;
    get numberOfChannels(): any;
    getChannelData(channel: any): any;
    copyFromChannel(destination: any, channelNumber: any, startInChannel: any): void;
    copyToChannel(source: any, channelNumber: any, startInChannel: any): void;
}
