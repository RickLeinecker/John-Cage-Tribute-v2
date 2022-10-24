export default BiquadFilterKernel;
declare class BiquadFilterKernel {
    constructor(coefficients: any);
    coefficients: any;
    _x1: any;
    _x2: any;
    _y1: any;
    _y2: any;
    process(input: any, output: any, inNumSamples: any): void;
    processWithCoefficients(input: any, output: any, inNumSamples: any, coefficients: any): void;
}
