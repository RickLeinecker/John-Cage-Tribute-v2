export default AnalyserNodeDSP;
declare namespace AnalyserNodeDSP {
    export function dspInit(sampleRate: any): void;
    export function dspInit(sampleRate: any): void;
    export function dspUpdateSizes(fftSize: any): void;
    export function dspUpdateSizes(fftSize: any): void;
    export function dspGetFloatFrequencyData(array: any): void;
    export function dspGetFloatFrequencyData(array: any): void;
    export function dspGetByteFrequencyData(array: any): void;
    export function dspGetByteFrequencyData(array: any): void;
    export function dspGetByteTimeDomainData(array: any): void;
    export function dspGetByteTimeDomainData(array: any): void;
    export function dspGetFloatTimeDomainData(array: any): void;
    export function dspGetFloatTimeDomainData(array: any): void;
    export function dspProcess(): void;
    export function dspProcess(): void;
}
