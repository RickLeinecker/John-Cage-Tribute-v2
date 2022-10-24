export default AudioBus;
/**
 * @prop {AudioData} audioData
 * @prop {boolean}   isSilent
 */
declare class AudioBus {
    /**
     * @param {number} numberOfChannels
     * @param {number} length
     * @param {number} sampleRate
     */
    constructor(numberOfChannels: number, length: number, sampleRate: number);
    audioData: any;
    isSilent: any;
    channelInterpretation: string;
    /**
     * @return {string} [ SPEAKERS, DISCRETE ]
     */
    getChannelInterpretation(): string;
    /**
     * @param {string} value - [ SPEAKERS, DISCRETE ]
     */
    setChannelInterpretation(value: string): void;
    /**
     * @return {number}
     */
    getNumberOfChannels(): number;
    /**
     * @param {number} numberOfChannels
     */
    setNumberOfChannels(numberOfChannels: number): void;
    /**
     * @return {number}
     */
    getLength(): number;
    /**
     * @return {number}
     */
    getSampleRate(): number;
    /**
     * @return {Float32Array[]}
     */
    getChannelData(): Float32Array[];
    /**
     * @return {Float32Array[]}
     */
    getMutableData(): Float32Array[];
    /**
     *
     */
    zeros(): void;
    /**
     * @param {AudioBus} audioBus
     */
    copyFrom(audioBus: AudioBus): void;
    /**
     * @param {AudioBus} audioBus
     * @param {number}   offset
     */
    copyFromWithOffset(audioBus: AudioBus, offset: number): void;
    /**
     * @param {AudioBus} audioBus
     */
    sumFrom(audioBus: AudioBus): void;
    /**
     * @param {AudioBus} audioBus
     * @param {number}   offset
     */
    sumFromWithOffset(audioBus: AudioBus, offset: number): void;
    /**
     * @private
     */
    private _sumFrom;
}
