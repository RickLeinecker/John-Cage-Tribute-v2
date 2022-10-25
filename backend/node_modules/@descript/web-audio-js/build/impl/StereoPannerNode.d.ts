export default StereoPannerNode;
declare class StereoPannerNode extends BasePannerNode {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {number}       opts.pan
     */
    constructor(context: any, opts?: {
        pan: number;
    });
    _pan: import("./AudioParam").default;
    /**
     * @param {AudioParam}
     */
    getPan(): import("./AudioParam").default;
}
import BasePannerNode from "./BasePannerNode";
