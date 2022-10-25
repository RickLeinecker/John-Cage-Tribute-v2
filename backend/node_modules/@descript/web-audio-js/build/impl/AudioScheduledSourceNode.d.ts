export default AudioScheduledSourceNode;
declare class AudioScheduledSourceNode extends AudioSourceNode {
    /**
     * @param {AudioContext} context
     */
    constructor(context: any, opts: any);
    _startTime: number;
    _stopTime: number;
    _startFrame: number;
    _stopFrame: number;
    /**
     * @return {number}
     */
    getStartTime(): number;
    /**
     * @return {number}
     */
    getStopTime(): number;
    /**
     * @return {string}
     */
    getPlaybackState(): string;
    /**
     * @param {number} when
     * @param {number} [offset]
     * @param {number} [duration]
     */
    start(when: number, offset?: number | undefined, duration?: number | undefined): void;
    /**
     * @param {number} when
     */
    stop(when: number): void;
}
import AudioSourceNode from "./AudioSourceNode";
