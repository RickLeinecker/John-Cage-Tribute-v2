export default PannerNode;
declare class PannerNode extends BasePannerNode {
    /**
     * @param {AudioContext} context
     */
    constructor(context: any, opts: any);
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setOrientation(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setVelocity(): void;
}
import BasePannerNode from "./BasePannerNode";
