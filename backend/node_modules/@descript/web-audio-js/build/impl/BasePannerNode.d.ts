export default BasePannerNode;
declare class BasePannerNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {string}       opts.panningModel
     * @param {string}       opts.distanceModel
     * @param {number}       opts.refDistance
     * @param {number}       opts.maxDistance
     * @param {number}       opts.rolloffFactor
     * @param {number}       opts.coneInnerAngle
     * @param {number}       opts.coneOuterAngle
     * @param {number}       opts.coneOuterGain
     */
    constructor(context: any, opts?: {
        panningModel: string;
        distanceModel: string;
        refDistance: number;
        maxDistance: number;
        rolloffFactor: number;
        coneInnerAngle: number;
        coneOuterAngle: number;
        coneOuterGain: number;
    });
    _panningModel: any;
    _distanceModel: any;
    _refDistance: any;
    _maxDistance: any;
    _rolloffFactor: any;
    _coneInnerAngle: any;
    _coneOuterAngle: any;
    _coneOuterGain: any;
    /**
     * @return {string}
     */
    getPanningModel(): string;
    /**
     * @param {string} value
     */
    setPanningModel(value: string): void;
    /**
     * @return {string}
     */
    getDistanceModel(): string;
    /**
     * @param {string} value
     */
    setDistanceModel(value: string): void;
    /**
     * @return {number}
     */
    getRefDistance(): number;
    /**
     * @param {number} value
     */
    setRefDistance(value: number): void;
    /**
     * @return {number}
     */
    getMaxDistance(): number;
    /**
     * @param {number} value
     */
    setMaxDistance(value: number): void;
    /**
     * @return {number}
     */
    getRolloffFactor(): number;
    /**
     * @param {number} value
     */
    setRolloffFactor(value: number): void;
    /**
     * @return {number}
     */
    getConeInnerAngle(): number;
    /**
     * @param {number} value
     */
    setConeInnerAngle(value: number): void;
    /**
     * @return {number}
     */
    getConeOuterAngle(): number;
    /**
     * @param {number} value
     */
    setConeOuterAngle(value: number): void;
    /**
     * @return {number}
     */
    getConeOuterGain(): number;
    /**
     * @param {number} value
     */
    setConeOuterGain(value: number): void;
}
import AudioNode from "./AudioNode";
