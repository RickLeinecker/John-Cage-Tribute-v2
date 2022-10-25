export default ChannelSplitterNode;
declare class ChannelSplitterNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.numberOfOutputs
     */
    constructor(context: any, opts?: {
        numberOfOutputs: number;
    });
}
import AudioNode from "./AudioNode";
