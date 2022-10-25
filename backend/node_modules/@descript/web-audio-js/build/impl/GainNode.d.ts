export default GainNode;
declare class GainNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.gain
     */
    constructor(context: any, opts?: {
        gain: number;
    });
    _gain: import("./AudioParam").default;
    /**
     * @return {AudioParam}
     */
    getGain(): any;
}
import AudioNode from "./AudioNode";
