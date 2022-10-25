export default ScriptProcessorNode;
declare class ScriptProcessorNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.bufferSize
     * @param {number}       opts.numberOfInputChannels
     * @param {number}       opts.numberOfOutputChannels
     */
    constructor(context: any, opts?: {
        bufferSize: number;
        numberOfInputChannels: number;
        numberOfOutputChannels: number;
    });
    _bufferSize: any;
    /**
     * @return {number}
     */
    getBufferSize(): number;
    /**
     * @return {object} eventItem
     */
    setEventItem(eventItem: any): object;
}
import AudioNode from "./AudioNode";
