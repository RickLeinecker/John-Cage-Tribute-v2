export default AudioParamDSP;
declare namespace AudioParamDSP {
    export function dspInit(): void;
    export function dspInit(): void;
    export function dspProcess(): any;
    export function dspProcess(): any;
    export function dspStaticValue(): void;
    export function dspStaticValue(): void;
    export function dspInputAndOffset(inputBus: any): void;
    export function dspInputAndOffset(inputBus: any): void;
    export function dspEvents(): void;
    export function dspEvents(): void;
    export function dspEventsAndInput(inputBus: any): void;
    export function dspEventsAndInput(inputBus: any): void;
    export function dspValuesForTimeRange(output: any): void;
    export function dspValuesForTimeRange(output: any): void;
}
