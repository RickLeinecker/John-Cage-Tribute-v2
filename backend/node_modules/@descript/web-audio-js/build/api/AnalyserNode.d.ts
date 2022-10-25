export default AnalyserNode;
declare class AnalyserNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.AnalyserNode;
    set fftSize(arg: number);
    get fftSize(): number;
    get frequencyBinCount(): number;
    set minDecibels(arg: number);
    get minDecibels(): number;
    set maxDecibels(arg: number);
    get maxDecibels(): number;
    set smoothingTimeConstant(arg: number);
    get smoothingTimeConstant(): number;
    getFloatFrequencyData(array: any): void;
    getByteFrequencyData(array: any): void;
    getFloatTimeDomainData(array: any): void;
    getByteTimeDomainData(array: any): void;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
