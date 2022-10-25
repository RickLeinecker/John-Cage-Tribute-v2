export default AnalyserNode;
declare class AnalyserNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.fftSize
     * @param {number}       opts.minDecibels
     * @param {number}       opts.maxDecibels
     * @param {number}       opts.smoothingTimeConstant
     */
    constructor(context: any, opts?: {
        fftSize: number;
        minDecibels: number;
        maxDecibels: number;
        smoothingTimeConstant: number;
    });
    _fftSize: any;
    _minDecibels: any;
    _maxDecibels: any;
    _smoothingTimeConstant: any;
    /**
     * @return {number}
     */
    getFftSize(): number;
    /**
     * @param {number} value
     */
    setFftSize(value: number): void;
    /**
     * @return {number}
     */
    getFrequencyBinCount(): number;
    /**
     * @return {number}
     */
    getMinDecibels(): number;
    /**
     * @param {number} value
     */
    setMinDecibels(value: number): void;
    /**
     * @return {number}
     */
    getMaxDecibels(): number;
    /**
     * @param {number} value
     */
    setMaxDecibels(value: number): void;
    /**
     * @return {number}
     */
    getSmoothingTimeConstant(): number;
    /**
     * @param {number}
     */
    setSmoothingTimeConstant(value: any): void;
    /**
     * @param {Float32Array} array
     */
    getFloatFrequencyData(array: Float32Array): void;
    /**
     * @param {Uint8Array} array
     */
    getByteFrequencyData(array: Uint8Array): void;
    /**
     * @param {Float32Array} array
     */
    getFloatTimeDomainData(array: Float32Array): void;
    /**
     * @param {Uint8Array} array
     */
    getByteTimeDomainData(array: Uint8Array): void;
}
import AudioNode from "./AudioNode";
