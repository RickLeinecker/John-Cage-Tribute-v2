export default AudioBuffer;
/**
 * @prop {AudioData} audioData
 */
declare class AudioBuffer {
    /**
     * @param {object}       opts
     * @param {number}       opts.numberOfChannels
     * @param {number}       opts.length
     * @param {number}       opts.sampleRate
     */
    constructor(opts?: {
        numberOfChannels: number;
        length: number;
        sampleRate: number;
    });
    audioData: AudioData;
    /**
     * @return {number}
     */
    getSampleRate(): number;
    /**
     * @return {number}
     */
    getLength(): number;
    /**
     * @return {number}
     */
    getDuration(): number;
    /**
     * @return {number}
     */
    getNumberOfChannels(): number;
    /**
     * @return {Float32Array}
     */
    getChannelData(channel: any): Float32Array;
    /**
     * @param {Float32Array} destination
     * @param {number}       channelNumber
     * @param {number}       startInChannel
     */
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel: number): void;
    /**
     * @param {Float32Array} source
     * @param {number}       channelNumber
     * @param {number}       startInChannel
     */
    copyToChannel(source: Float32Array, channelNumber: number, startInChannel: number): void;
}
import AudioData from "./core/AudioData";
