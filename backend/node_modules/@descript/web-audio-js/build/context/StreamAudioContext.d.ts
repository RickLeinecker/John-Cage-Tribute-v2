export default StreamAudioContext;
declare class StreamAudioContext extends BaseAudioContext {
    /**
     * @param {object}  opts
     * @param {number}  opts.sampleRate
     * @param {number}  opts.blockSize
     * @param {number}  opts.numberOfChannels
     * @param {number}  opts.bitDepth
     * @param {boolean} opts.floatingPoint
     */
    constructor(opts?: {
        sampleRate: number;
        blockSize: number;
        numberOfChannels: number;
        bitDepth: number;
        floatingPoint: boolean;
    });
    /**
     * @return {number}
     */
    get numberOfChannels(): number;
    /**
     * @return {number}
     */
    get blockSize(): number;
    /**
     * @return {object}
     */
    get format(): object;
    /**
     * @param {Writable}
     * @return {Writable}
     */
    pipe(stream: any): any;
    _stream: any;
    /**
     * @return {Promise<void>}
     */
    resume(): Promise<void>;
    /**
     * @return {Promise<void>}
     */
    suspend(): Promise<void>;
    /**
     * @return {Promise<void>}
     */
    close(): Promise<void>;
    _resume(): void;
    _isPlaying: boolean | undefined;
    _suspend(): void;
    _close(): void;
}
import BaseAudioContext from "../api/BaseAudioContext";
