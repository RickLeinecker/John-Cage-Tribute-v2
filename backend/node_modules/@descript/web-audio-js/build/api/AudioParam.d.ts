export default AudioParam;
declare class AudioParam {
    constructor(context: any, impl: any);
    set value(arg: any);
    get value(): any;
    get defaultValue(): any;
    setValueAtTime(value: any, startTime: any): AudioParam;
    linearRampToValueAtTime(value: any, endTime: any): AudioParam;
    exponentialRampToValueAtTime(value: any, endTime: any): AudioParam;
    setTargetAtTime(target: any, startTime: any, timeConstant: any): AudioParam;
    setValueCurveAtTime(values: any, startTime: any, duration: any): AudioParam;
    cancelScheduledValues(startTime: any): AudioParam;
}
