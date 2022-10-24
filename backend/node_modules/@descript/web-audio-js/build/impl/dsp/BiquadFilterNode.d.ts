export default BiquadFilterNodeDSP;
declare namespace BiquadFilterNodeDSP {
    export function dspInit(): void;
    export function dspInit(): void;
    export function dspUpdateKernel(numberOfChannels: any): void;
    export function dspUpdateKernel(numberOfChannels: any): void;
    export function dspProcess1(): void;
    export function dspProcess1(): void;
    export function dspProcess2(): void;
    export function dspProcess2(): void;
    export function dspProcessN(): void;
    export function dspProcessN(): void;
    export function dspUpdateCoefficients(): boolean;
    export function dspUpdateCoefficients(): boolean;
    export function dspGetFrequencyResponse(frequencyHz: any, magResponse: any, phaseResponse: any): void;
    export function dspGetFrequencyResponse(frequencyHz: any, magResponse: any, phaseResponse: any): void;
}
