export default ChannelMergerNode;
declare class ChannelMergerNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.numberOfInputs
     */
    constructor(context: any, opts?: {
        numberOfInputs: number;
    });
}
import AudioNode from "./AudioNode";
