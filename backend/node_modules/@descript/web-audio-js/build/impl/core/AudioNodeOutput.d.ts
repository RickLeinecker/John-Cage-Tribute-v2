export default AudioNodeOutput;
/**
 * @prop {AudioNode} node
 * @prop {number}    index
 * @prop {AudioBus}  bus
 */
declare class AudioNodeOutput {
    /**
     * @param {object} opts
     * @param {AudioNode} opts.node
     * @param {number}    opts.index
     * @param {number}    opts.numberOfChannels
     * @param {boolean}   opts.enabled
     */
    constructor(opts: {
        node: any;
        index: number;
        numberOfChannels: number;
        enabled: boolean;
    });
    node: any;
    index: number;
    bus: AudioBus;
    inputs: any[];
    _enabled: boolean;
    /**
     * @return {number}
     */
    getNumberOfChannels(): number;
    /**
     * @param {number} numberOfChannels
     */
    setNumberOfChannels(numberOfChannels: number): void;
    /**
     * @return {boolean}
     */
    isEnabled(): boolean;
    /**
     *
     */
    enable(): void;
    /**
     *
     */
    disable(): void;
    /**
     *
     */
    zeros(): void;
    /**
     * @param {AudioNode|AudioParam} destination
     * @param {number}               index
     */
    connect(destination: any, input: any): void;
    /**
     *
     */
    disconnect(...args: any[]): void;
    /**
     * @return {boolean}
     */
    isConnectedTo(node: any): boolean;
    /**
     * @return {AudioBus}
     */
    pull(): AudioBus;
}
import AudioBus from "./AudioBus";
