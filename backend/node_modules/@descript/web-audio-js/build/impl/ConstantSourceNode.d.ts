export default ConstantSourceNode;
declare class ConstantSourceNode extends AudioScheduledSourceNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.offset
     */
    constructor(context: any, opts?: {
        offset: number;
    });
    _offset: import("./AudioParam").default;
    /**
     * @return {AudioParam}
     */
    getOffset(): any;
}
import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
