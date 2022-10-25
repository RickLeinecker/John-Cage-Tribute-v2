export default OfflineAudioContext;
declare class OfflineAudioContext extends BaseAudioContext {
    /**
     * @param {number} numberOfChannels
     * @param {number} length
     * @param {number} sampleRate
     */
    constructor(numberOfChannels: number, length: number, sampleRate: number);
    /**
     * @return {number}
     */
    get length(): number;
    /**
     * @param {function} callback
     */
    set oncomplete(arg: Function);
    /**
     * @return {function}
     */
    get oncomplete(): Function;
    /**
     * @return {Promise<void>}
     */
    resume(): Promise<void>;
    /**
     * @param {number} time
     * @return {Promise<void>}
     */
    suspend(time: number): Promise<void>;
    _suspendedTime: number | undefined;
    _suspendPromise: Promise<any> | undefined;
    _suspendResolve: ((value?: any) => void) | undefined;
    /**
     * @return {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * @return {Promise<AudioBuffer>}
     */
    startRendering(): Promise<AudioBuffer>;
    _renderingPromise: Promise<any> | undefined;
    _audioData: {
        numberOfChannels: any;
        length: any;
        sampleRate: any;
        channelData: any[];
    } | undefined;
    _renderingResolve: ((value?: any) => void) | undefined;
}
import BaseAudioContext from "../api/BaseAudioContext";
import AudioBuffer from "../api/AudioBuffer";
