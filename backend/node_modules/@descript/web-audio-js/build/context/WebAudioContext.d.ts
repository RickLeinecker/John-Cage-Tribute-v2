export default WebAudioContext;
declare class WebAudioContext extends BaseAudioContext {
    /**
     * @param {object}  opts
     * @param {AudioContext} opts.context
     * @param {AudioNode}    opts.destination
     * @param {number}       opts.blockSize
     * @param {number}       opts.numberOfChannels
     * @param {number}       opts.bufferSize
     */
    constructor(opts?: {
        context: any;
        destination: any;
        blockSize: number;
        numberOfChannels: number;
        bufferSize: number;
    });
    get originalContext(): any;
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
    _processor: any;
}
import BaseAudioContext from "../api/BaseAudioContext";
