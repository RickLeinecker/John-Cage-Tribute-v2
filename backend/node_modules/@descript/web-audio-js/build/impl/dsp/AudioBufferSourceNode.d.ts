export default AudioBufferSourceNodeDSP;
declare namespace AudioBufferSourceNodeDSP {
    export function dspInit(): void;
    export function dspInit(): void;
    export function dspStart(): void;
    export function dspStart(): void;
    export function dspProcess(): void;
    export function dspProcess(): void;
    export function dspBufferRendering(outputs: any, writeIndex: any, inNumSamples: any, sampleRate: any): any;
    export function dspBufferRendering(outputs: any, writeIndex: any, inNumSamples: any, sampleRate: any): any;
    export function dspEmitEnded(): void;
    export function dspEmitEnded(): void;
}
