export default AudioNodeInput;
/**
 * @prop {AudioNode} node
 * @prop {number}    index
 * @prop {AudioBus}  bus
 */
declare class AudioNodeInput {
    /**
     * @param {object}    opts
     * @param {AudioNode} opts.node
     * @param {number}    opts.index
     * @param {number}    opts.numberOfChannels
     * @param {number}    opts.channelCount
     * @param {string}    opts.channelCountMode
     */
    constructor(opts: {
        node: any;
        index: number;
        numberOfChannels: number;
        channelCount: number;
        channelCountMode: string;
    });
    node: any;
    index: number;
    bus: AudioBus;
    outputs: any[];
    _disabledOutputs: WeakSet<object>;
    _channelCount: any;
    _channelCountMode: any;
    /**
     * @return {number}
     */
    getChannelCount(): number;
    /**
     * @param {number} value
     */
    setChannelCount(value: number): void;
    /**
     * @return {number}
     */
    getChannelCountMode(): number;
    /**
     * @param {number} value
     */
    setChannelCountMode(value: number): void;
    /**
     * @return {string}
     */
    getChannelInterpretation(): string;
    /**
     * @param {string} value
     */
    setChannelInterpretation(value: string): void;
    /**
     * @return {number}
     */
    getNumberOfChannels(): number;
    /**
     *
     */
    computeNumberOfChannels(): any;
    /**
     *
     */
    updateNumberOfChannels(): void;
    /**
     * @return {boolean}
     */
    isEnabled(): boolean;
    /**
     * @param {AudioNodeOutput} output
     */
    enableFrom(output: any): void;
    /**
     * @param {AudioNodeOutput} output
     */
    disableFrom(output: any): void;
    /**
     * @param {AudioNodeOutput} output
     */
    connectFrom(output: any): void;
    /**
     * @param {AudioNodeOutput} output
     */
    disconnectFrom(output: any): void;
    /**
     *
     */
    inputDidUpdate(): void;
    /**
     * @return {boolean}
     */
    isConnectedFrom(node: any): boolean;
    /**
     * @return {AudioBus}
     */
    sumAllConnections(): AudioBus;
    /**
     * @return {AudioBus}
     */
    pull(): AudioBus;
}
import AudioBus from "./AudioBus";
