export default BiquadFilterNode;
declare class BiquadFilterNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {string}       opts.type
     * @param {number}       opts.frequency
     * @param {number}       opts.detune
     * @param {number}       opts.Q
     * @param {number}       opts.gain
     */
    constructor(context: any, opts?: {
        type: string;
        frequency: number;
        detune: number;
        Q: number;
        gain: number;
    });
    _type: any;
    _frequency: import("./AudioParam").default;
    _detune: import("./AudioParam").default;
    _Q: import("./AudioParam").default;
    _gain: import("./AudioParam").default;
    /**
     * @return {string}
     */
    getType(): string;
    /**
     * @param {string} value
     */
    setType(value: string): void;
    /**
     * @return {AudioParam}
     */
    getFrequency(): any;
    /**
     * @return {AudioParam}
     */
    getDetune(): any;
    /**
     * @return {AudioParam}
     */
    getQ(): any;
    /**
     * @return {AudioParam}
     */
    getGain(): any;
    /**
     * @param {Float32Array} frequencyHz
     * @param {Float32Array} magResponse
     * @param {Float32Array} phaseResponse
     */
    getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
}
import AudioNode from "./AudioNode";
