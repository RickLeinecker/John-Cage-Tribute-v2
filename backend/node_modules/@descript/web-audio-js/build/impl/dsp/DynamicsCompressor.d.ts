export class DynamicsCompressor {
    constructor(sampleRate: any, numberOfChannels: any);
    numberOfChannels: any;
    sampleRate: any;
    nyquist: number;
    compressor: DynamicsCompressorKernel;
    lastFilterStageRatio: number;
    lastAnchor: number;
    lastFilterStageGain: number;
    parameters: any[];
    setParameterValue(parameterId: any, value: any): void;
    initializeParameters(): void;
    parameterValue(parameterId: any): any;
    process(sourceBus: any, destinatonBus: any, framesToProcess: any): void;
    reset(): void;
    setNumberOfChannels(numberOfChannels: any): void;
    sourceChannels: any[] | undefined;
    destinationChannels: any[] | undefined;
    dspProcess(inputs: any, outputs: any, blockSize: any): void;
}
export namespace CompressorParameters {
    export { THRESHOLD };
    export { KNEE };
    export { RATIO };
    export { ATTACK };
    export { RELEASE };
    export { REDUCTION };
}
import DynamicsCompressorKernel from "./DynamicsCompressorKernel";
declare const THRESHOLD: 0;
declare const KNEE: 1;
declare const RATIO: 2;
declare const ATTACK: 3;
declare const RELEASE: 4;
declare const REDUCTION: 15;
export {};
