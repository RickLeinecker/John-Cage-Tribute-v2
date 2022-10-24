export default AudioContext;
/**
 * @prop {number} sampleRate
 * @prop {number} blockSize
 * @prop {number} numberOfChannels
 * @prop {number} currentTime
 * @prop {number} currentSampleFrame
 */
declare class AudioContext extends EventTarget {
    /**
     * @param {object} opts
     * @param {number} opts.sampleRate
     * @param {number} opts.blockSize
     * @param {number} opts.numberOfChannels
     */
    constructor(opts?: {
        sampleRate: number;
        blockSize: number;
        numberOfChannels: number;
    });
    sampleRate: number;
    blockSize: number;
    numberOfChannels: number;
    currentTime: number;
    currentSampleFrame: number;
    state: string;
    _destination: AudioDestinationNode;
    _listener: AudioListener;
    _sched: {};
    _callbacksForPostProcess: Function[] | null;
    _currentFrameIndex: number;
    /**
     * @return {AudioDestinationNode}
     */
    getDestination(): AudioDestinationNode;
    /**
     * @return {number}
     */
    getSampleRate(): number;
    /**
     * @return {number}
     */
    getCurrentTime(): number;
    /**
     * @return {AudioListener}
     */
    getListener(): AudioListener;
    /**
     * @return {string}
     */
    getState(): string;
    /**
     * @return {Promise<void>}
     */
    suspend(): Promise<void>;
    /**
     * @return {Promise<void>}
     */
    resume(): Promise<void>;
    /**
     * @return {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * @param {string} state
     * @return {Promise<void>}
     */
    changeState(state: string): Promise<void>;
    /**
     * @return {Promise<void>}
     */
    notChangeState(): Promise<void>;
    /**
     * @param {number}   time
     * @param {function} task
     */
    sched(time: number, task: Function): void;
    /**
     * @param {function} task
     */
    addPostProcess(task: Function): void;
    /**
     * @param {Float32Array[]} channelData
     * @param {number}         offset
     */
    process(channelData: Float32Array[], offset: number): void;
    /**
     *
     */
    reset(): void;
}
import EventTarget from "./EventTarget";
import AudioDestinationNode from "./AudioDestinationNode";
import AudioListener from "./AudioListener";
