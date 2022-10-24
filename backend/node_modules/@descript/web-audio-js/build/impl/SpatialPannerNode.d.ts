export default SpatialPannerNode;
declare class SpatialPannerNode extends BasePannerNode {
    /**
     * @param {AudioContext}
     */
    constructor(context: any, opts: any);
    _positionX: import("./AudioParam").default;
    _positionY: import("./AudioParam").default;
    _positionZ: import("./AudioParam").default;
    _orientationX: import("./AudioParam").default;
    _orientationY: import("./AudioParam").default;
    _orientationZ: import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getPositionX(): import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getPositionY(): import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getPositionZ(): import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getOrientationX(): import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getOrientationY(): import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getOrientationZ(): import("./AudioParam").default;
}
import BasePannerNode from "./BasePannerNode";
