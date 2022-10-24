export default WaveShaperNode;
declare class WaveShaperNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {Float32Arrat} opts.curve
     * @param {string}       opts.overSample
     */
    constructor(context: any, opts?: {
        curve: any;
        overSample: string;
    });
    _curve: any;
    _overSample: any;
    /**
     * @return {Float32Array}
     */
    getCurve(): Float32Array;
    /**
     * @param {Float32Array} value
     */
    setCurve(value: Float32Array): void;
    /**
     * @return {boolean}
     */
    getOversample(): boolean;
    /**
     * @param {boolean} value
     */
    setOversample(value: boolean): void;
}
import AudioNode from "./AudioNode";
