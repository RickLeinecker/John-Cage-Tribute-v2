export default SpatialListener;
declare class SpatialListener {
    /**
     * @param {AudioContext} context
     */
    constructor(context: any);
    context: any;
    _positionX: AudioParam;
    _positionY: AudioParam;
    _positionZ: AudioParam;
    _forwardX: AudioParam;
    _forwardY: AudioParam;
    _forwardZ: AudioParam;
    _upX: AudioParam;
    _upY: AudioParam;
    _upZ: AudioParam;
    /**
     * @return {AudioParam}
     */
    getPositionX(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getPositionY(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getPositionZ(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getForwardX(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getForwardY(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getForwardZ(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getUpX(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getUpY(): AudioParam;
    /**
     * @return {AudioParam}
     */
    getUpZ(): AudioParam;
}
import AudioParam from "./AudioParam";
