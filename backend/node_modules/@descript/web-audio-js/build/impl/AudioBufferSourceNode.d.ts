export default AudioBufferSourceNode;
declare class AudioBufferSourceNode extends AudioScheduledSourceNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.playbackRate
     * @param {number}       opts.detune
     * @param {boolean}      opts.loop
     * @param {number}       opts.loopStart
     * @param {number}       opts.loopEnd
     */
    constructor(context: any, opts?: {
        playbackRate: number;
        detune: number;
        loop: boolean;
        loopStart: number;
        loopEnd: number;
    });
    _buffer: AudioBuffer | null;
    _audioData: import("./core/AudioData").default | null;
    _playbackRate: import("./AudioParam").default;
    _detune: import("./AudioParam").default;
    _loop: boolean;
    _loopStart: any;
    _loopEnd: any;
    _offset: number;
    _duration: number;
    _done: boolean;
    /**
     * @return {AudioBuffer}
     */
    getBuffer(): AudioBuffer;
    /**
     * @param {AudioBuffer} value
     */
    setBuffer(value: AudioBuffer): void;
    /**
     * @return {number}
     */
    getStartOffset(): number;
    /**
     * @return {number}
     */
    getStartDuration(): number;
    /**
     * @return {AudioParam}
     */
    getPlaybackRate(): any;
    /**
     * @return {AudioParam}
     */
    getDetune(): any;
    /**
     * @return {boolean}
     */
    getLoop(): boolean;
    /**
     * @param {boolean}
     */
    setLoop(value: any): void;
    /**
     * @return {number}
     */
    getLoopStart(): number;
    /**
     * @param {number} value
     */
    setLoopStart(value: number): void;
    /**
     * @return {number}
     */
    getLoopEnd(): number;
    /**
     * @param {number} value
     */
    setLoopEnd(value: number): void;
}
import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
import AudioBuffer from "./AudioBuffer";
