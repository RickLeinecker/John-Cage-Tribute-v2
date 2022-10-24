export default GainNode;
declare class GainNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.GainNode;
    get gain(): any;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
