export default OscillatorNode;
declare class OscillatorNode extends AudioScheduledSourceNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {string}       opts.type
     * @param {number}       opts.frequency
     * @param {number}       opts.detune
     */
    constructor(context: any, opts?: {
        type: string;
        frequency: number;
        detune: number;
    });
    _frequency: import("./AudioParam").default;
    _detune: import("./AudioParam").default;
    _type: any;
    _periodicWave: PeriodicWave;
    _waveTable: Float32Array | null;
    /**
     * @return {string}
     */
    getType(): string;
    /**
     * @param {string} value
     */
    setType(value: string): void;
    /**
     * @param {AudioParam}
     */
    getFrequency(): import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getDetune(): import("./AudioParam").default;
    /**
     * @param {PeriodicWave} periodicWave
     */
    setPeriodicWave(periodicWave: PeriodicWave): void;
    /**
     * @return {PeriodicWave}
     */
    getPeriodicWave(): PeriodicWave;
    /**
     * @param {string} type
     * @return {PeriodicWave}
     */
    buildPeriodicWave(type: string): PeriodicWave;
}
import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
import PeriodicWave from "./PeriodicWave";
