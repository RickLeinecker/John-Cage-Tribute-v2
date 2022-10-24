export default WaveShaperNode;
declare class WaveShaperNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.WaveShaperNode;
    set curve(arg: Float32Array);
    get curve(): Float32Array;
    set oversample(arg: boolean);
    get oversample(): boolean;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
