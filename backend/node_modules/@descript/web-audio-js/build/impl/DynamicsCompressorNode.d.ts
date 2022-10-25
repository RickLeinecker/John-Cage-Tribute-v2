export default DynamicsCompressorNode;
declare class DynamicsCompressorNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.threshold
     * @param {number}       opts.knee
     * @param {number}       opts.ratio
     * @param {number}       opts.attack
     * @param {number}       opts.release
     */
    constructor(context: any, opts?: {
        threshold: number;
        knee: number;
        ratio: number;
        attack: number;
        release: number;
    });
    _threshold: import("./AudioParam").default;
    _knee: import("./AudioParam").default;
    _ratio: import("./AudioParam").default;
    _attack: import("./AudioParam").default;
    _release: import("./AudioParam").default;
    compressor: DynamicsCompressor;
    /**
     * @return {AudioParam}
     */
    getThreshold(): any;
    /**
     * @return {AudioParam}
     */
    getKnee(): any;
    /**
     * @return {AudioParam}
     */
    getRatio(): any;
    /**
     * @return {number}
     */
    getReduction(): number;
    /**
     * @return {AudioParam}
     */
    getAttack(): any;
    /**
     * @return {AudioParam}
     */
    getRelease(): any;
}
import AudioNode from "./AudioNode";
import { DynamicsCompressor } from "./dsp/DynamicsCompressor";
