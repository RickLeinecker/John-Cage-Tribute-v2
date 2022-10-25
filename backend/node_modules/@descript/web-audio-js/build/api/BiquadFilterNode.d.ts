export default BiquadFilterNode;
declare class BiquadFilterNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.BiquadFilterNode;
    set type(arg: string);
    get type(): string;
    get frequency(): any;
    get detune(): any;
    get Q(): any;
    get gain(): any;
    getFrequencyResponse(frequencyHz: any, magResponse: any, phaseResponse: any): void;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
