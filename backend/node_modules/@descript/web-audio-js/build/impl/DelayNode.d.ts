export default DelayNode;
declare class DelayNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.maxDelayTime
     * @param {number}       opts.delayTime
     */
    constructor(context: any, opts?: {
        maxDelayTime: number;
        delayTime: number;
    });
    _maxDelayTime: any;
    _delayTime: import("./AudioParam").default;
    /**
     * @return {number}
     */
    getDelayTime(): number;
    /**
     * @return {number}
     */
    getMaxDelayTime(): number;
}
import AudioNode from "./AudioNode";
