export default IIRFilterKernel;
declare class IIRFilterKernel {
    constructor(feedforward: any, feedback: any);
    a: Float32Array;
    b: Float32Array;
    x: Float32Array;
    y: Float32Array;
    process(input: any, output: any, inNumSamples: any): void;
}
