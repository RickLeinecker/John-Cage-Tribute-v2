export default AudioDestinationNode;
/**
 * @prop {AudioNodeOutput} output
 * @prop {AudioBus}        outputBus
 */
declare class AudioDestinationNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.numberOfChannels
     */
    constructor(context: any, opts?: {
        numberOfChannels: number;
    });
    _numberOfChannels: number;
    _destinationChannelData: any;
    /**
     * @return {number}
     */
    getMaxChannelCount(): number;
    /**
     * @param {Float32Array[]} channelData
     * @param {number}         offset
     */
    process(channelData: Float32Array[], offset: number): void;
}
import AudioNode from "./AudioNode";
