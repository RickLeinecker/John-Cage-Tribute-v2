export default AudioNode;
/**
 * @prop {AudioContext}      context
 * @prop {number}            blockSize
 * @prop {number}            sampleRate
 * @prop {AudioNodeInput[]}  inputs
 * @prop {AudioNodeOutput[]} outputs
 */
declare class AudioNode extends EventTarget {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.channelCount
     * @param {string}       opts.channelCountMode
     * @param {string}       opts.channelInterpretation
     * @param {number[]}     config.inputs
     * @param {number[]}     config.outputs
     * @param {number}       config.channelCount
     * @param {string}       config.channelCountMode
     */
    constructor(context: any, opts?: {
        channelCount: number;
        channelCountMode: string;
        channelInterpretation: string;
    }, config?: {});
    context: any;
    blockSize: any;
    sampleRate: any;
    inputs: any[];
    outputs: any[];
    channelCount: any;
    channelCountMode: any;
    channelInterpretation: any;
    allowedMinChannelCount: any;
    allowedMaxChannelCount: any;
    allowedChannelCountMode: any;
    allowedChannelInterpretation: any;
    currentSampleFrame: number;
    _params: any[];
    _enabled: boolean;
    _disableAtSampleFrame: number;
    /**
     * @return {number}
     */
    getNumberOfInputs(): number;
    /**
     * @return {number}
     */
    getNumberOfOutputs(): number;
    /**
     * @return {number}
     */
    getChannelCount(): number;
    /**
     * @param {number} value
     */
    setChannelCount(value: number): void;
    /**
     * @return {string}
     */
    getChannelCountMode(): string;
    /**
     * @param {string} value
     */
    setChannelCountMode(value: string): void;
    /**
     * @return {string}
     */
    getChannelInterpretation(): string;
    /**
     * @param {string} value
     */
    setChannelInterpretation(value: string): void;
    /**
     * @param {AudioNode|AudioParam} destination
     * @param {number}               output
     * @param {number}               input
     */
    connect(destination: AudioNode | AudioParam, output: number, input: number): void;
    /**
     *
     */
    disconnect(...args: any[]): void;
    /**
     * @param {number} numberOfChannels
     * @param {number} channelCount
     * @param {string} channelCountMode
     * @return {AudioNodeInput}
     */
    addInput(numberOfChannels: number, channelCount: number, channelCountMode: string): AudioNodeInput;
    /**
     * @param {number} numberOfChannels
     * @return {AudioNodeOutput}
     */
    addOutput(numberOfChannels: number): AudioNodeOutput;
    /**
     * @param {string} rate - [ "audio", "control" ]
     * @param {number} defaultValue
     * @return {AudioParam}
     */
    addParam(rate: string, defaultValue: number): AudioParam;
    /**
     * @return {boolean}
     */
    isEnabled(): boolean;
    /**
     * @return {number}
     */
    getTailTime(): number;
    /**
     *
     */
    enableOutputsIfNecessary(): void;
    /**
     *
     */
    disableOutputsIfNecessary(): void;
    /**
     * @private
     */
    private _disableOutputsIfNecessary;
    /**
     * @param {number} numberOfChannels
     */
    channelDidUpdate(numberOfChannels: number): void;
    /**
     *
     */
    disconnectAll(): void;
    /**
     * @param {number} output
     */
    disconnectAllFromOutput(output: number): void;
    /**
     * @param {AudioNode|AudioParam} destination
     */
    disconnectIfConnected(destination: AudioNode | AudioParam): void;
    /**
     * @param {number} output
     * @param {AudioNode|AudioParam} destination
     * @param {number} output
     */
    disconnectFromOutputIfConnected(output: number, destination: AudioNode | AudioParam, input: any): void;
    /**
     *
     */
    processIfNecessary(): void;
    dspInit(): void;
    dspProcess(): void;
}
import EventTarget from "./EventTarget";
import AudioParam from "./AudioParam";
import AudioNodeInput from "./core/AudioNodeInput";
import AudioNodeOutput from "./core/AudioNodeOutput";
