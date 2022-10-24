export default DelayNode;
declare class DelayNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.DelayNode;
    get delayTime(): any;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
