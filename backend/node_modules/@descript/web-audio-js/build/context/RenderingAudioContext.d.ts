export default RenderingAudioContext;
declare class RenderingAudioContext extends BaseAudioContext {
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
     * @param {number|string} time
     */
    processTo(time: string | number): void;
    /**
     * @return {AudioData}
     */
    exportAsAudioData(): any;
    /**
     * @param {AudioData} audioData
     * @param {object}    opts
     */
    encodeAudioData(audioData: any, opts: object): Promise<ArrayBuffer>;
}
import BaseAudioContext from "../api/BaseAudioContext";
