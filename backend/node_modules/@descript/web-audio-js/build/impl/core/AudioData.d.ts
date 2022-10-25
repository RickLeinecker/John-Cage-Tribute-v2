export default AudioData;
/**
 * AudioData is struct like AudioBuffer.
 * This instance has no methods.
 * The channel data of this instance are taken via property accessor.
 * @prop {number}         numberOfChannels
 * @prop {number}         length
 * @prop {number}         sampleRate
 * @prop {Float32Array[]} channelData
 */
declare class AudioData {
    /**
     * @param {number} numberOfChannels
     * @param {number} length
     * @param {number} sampleRate
     * @param {Float32Array[]} [channelData]
     */
    constructor(numberOfChannels: number, length: number, sampleRate: number, channelData?: Float32Array[] | undefined);
    numberOfChannels: number;
    length: number;
    sampleRate: number;
    channelData: any[];
}
