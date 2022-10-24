export default ConstantSourceNode;
declare class ConstantSourceNode extends AudioScheduledSourceNode {
    constructor(context: any, opts: any);
    _impl: impl.ConstantSourceNode;
    get offset(): any;
}
import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
import * as impl from "../impl";
