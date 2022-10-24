export default ConvolverNode;
declare class ConvolverNode extends AudioNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {boolean}      opts.disableNormalization
     */
    constructor(context: any, opts?: {
        disableNormalization: boolean;
    });
    _buffer: AudioBuffer | null;
    _audioData: import("./core/AudioData").default | null;
    _normalize: boolean;
    /**
     * @return {AudioBuffer}
     */
    getBuffer(): AudioBuffer;
    /**
     * @param {AudioBuffer} value
     */
    setBuffer(value: AudioBuffer): void;
    /**
     * @return {boolean}
     */
    getNormalize(): boolean;
    /**
     * @param {boolean} value
     */
    setNormalize(value: boolean): void;
}
import AudioNode from "./AudioNode";
import AudioBuffer from "./AudioBuffer";
