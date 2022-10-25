export default IIRFilterNode;
declare class IIRFilterNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.IIRFilterNode;
    getFrequencyResponse(frequencyHz: any, magResponse: any, phaseResponse: any): void;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
