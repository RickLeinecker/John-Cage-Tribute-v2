export default PeriodicWave;
declare class PeriodicWave {
    /**
     * @param {AudioContext} context
     * @param {object}       opts
     * @param {Float32Array} opts.real
     * @param {Float32Array} opts.imag
     * @param {boolean}      opts.constraints
     */
    constructor(context: any, opts?: {
        real: Float32Array;
        imag: Float32Array;
        constraints: boolean;
    });
    context: any;
    _real: Float32Array;
    _imag: Float32Array;
    _constants: boolean;
    _name: string;
    /**
     * @return {Float32Array}
     */
    getReal(): Float32Array;
    /**
     * @return {Float32Array}
     */
    getImag(): Float32Array;
    /**
     * @return {booleam}
     */
    getConstraints(): any;
    /**
     * @return {string}
     */
    getName(): string;
    /**
     * @return {Float32Array}
     */
    getWaveTable(): Float32Array;
    _waveTable: any;
    generateBasicWaveform(type: any): void;
}
