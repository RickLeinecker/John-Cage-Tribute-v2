export default ScriptProcessorNode;
declare class ScriptProcessorNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.ScriptProcessorNode;
    get bufferSize(): number;
    set onaudioprocess(arg: any);
    get onaudioprocess(): any;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
