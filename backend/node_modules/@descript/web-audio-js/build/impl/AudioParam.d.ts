export default AudioParam;
/**
 * @prop {AudioContext}      context
 * @prop {number}            blockSize
 * @prop {number}            sampleRate
 * @prop {AudioNodeInput[]}  inputs
 * @prop {AudioBus}          outputBus
 */
declare class AudioParam {
    /**
     * @param {AudioContext} context
     * @param {string}       opts.rate - [ AUDIO_RATE, CONTROL_RATE ]
     * @param {number}       opts.defaultValue
     */
    constructor(context: any, opts?: {});
    context: any;
    blockSize: any;
    sampleRate: any;
    inputs: AudioNodeInput[];
    outputBus: AudioBus;
    _rate: any;
    _defaultValue: number;
    _value: any;
    _userValue: any;
    _timeline: any;
    /**
     * @return {number}
     */
    getValue(): number;
    /**
     * @param {number} value
     */
    setValue(value: number): void;
    /**
     * @return {number}
     */
    getDefaultValue(): number;
    /**
     * @param {number} value
     * @param {number} startTime
     */
    setValueAtTime(value: number, startTime: number): void;
    _currentEventIndex: number | undefined;
    _remainSamples: number | undefined;
    /**
     * @param {number} value
     * @param {number} endTime
     */
    linearRampToValueAtTime(value: number, endTime: number): void;
    /**
     * @param {number} value
     * @param {number} endTime
     */
    exponentialRampToValueAtTime(value: number, endTime: number): void;
    /**
     * @param {number} target
     * @param {number} startTime
     * @param {number} timeConstant
     */
    setTargetAtTime(target: number, startTime: number, timeConstant: number): void;
    /**
     * @param {Float32Array[]} values
     * @param {number}         startTime
     * @param {number}         duration
     */
    setValueCurveAtTime(values: Float32Array[], startTime: number, duration: number): void;
    /**
     * @param {number} startTime
     */
    cancelScheduledValues(startTime: number): void;
    /**
     * @return {string}
     */
    getRate(): string;
    /**
     * @return {boolean}
     */
    hasSampleAccurateValues(): boolean;
    /**
     * @return {Float32Array}
     */
    getSampleAccurateValues(): Float32Array;
    /**
     *
     */
    enableOutputsIfNecessary(): void;
    /**
     *
     */
    disableOutputsIfNecessary(): void;
    /**
     * @return {object[]}
     */
    getTimeline(): object[];
    /**
     * @return {object[]}
     */
    getEvents(): object[];
    /**
     * @param {object}
     * @return {number}
     */
    insertEvent(eventItem: any): number;
}
import AudioNodeInput from "./core/AudioNodeInput";
import AudioBus from "./core/AudioBus";
