export default AudioListener;
declare class AudioListener {
    /**
     * @param {AudioContext} context
     */
    constructor(context: any);
    context: any;
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
     * @param {number} xUp
     * @param {number} yUp
     * @param {number} zUp
     */
    setOrientation(): void;
}
