export default IIRFilterNode;
declare class IIRFilterNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {Float32Array} opts.feedforward
     * @param {Float32Array} opts.feedback
     */
    constructor(context: any, opts?: {
        feedforward: Float32Array;
        feedback: Float32Array;
    });
    _feedforward: any;
    _feedback: any;
    /**
     * @param {Float32Array} frequencyHz
     * @param {Float32Array} magResponse
     * @param {Float32Array} phaseResponse
     */
    getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
    /**
     * @return {Float32Array}
     */
    getFeedforward(): Float32Array;
    /**
     * @return {Float32Array}
     */
    getFeedback(): Float32Array;
}
import AudioNode from "./AudioNode";
