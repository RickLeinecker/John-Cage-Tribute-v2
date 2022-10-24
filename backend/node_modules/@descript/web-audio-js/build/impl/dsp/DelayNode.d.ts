export default DelayNodeDSP;
declare namespace DelayNodeDSP {
    export function dspInit(maxDelayTime: any): void;
    export function dspInit(maxDelayTime: any): void;
    export function dspComputeDelayBufferLength(delayTime: any): any;
    export function dspComputeDelayBufferLength(delayTime: any): any;
    export function dspUpdateKernel(numberOfChannels: any): void;
    export function dspUpdateKernel(numberOfChannels: any): void;
    export function dspProcess1(): void;
    export function dspProcess1(): void;
    export function dspProcess2(): void;
    export function dspProcess2(): void;
    export function dspProcessN(): void;
    export function dspProcessN(): void;
}
