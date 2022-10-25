export default ConvolverNode;
declare class ConvolverNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.ConvolverNode;
    set buffer(arg: any);
    get buffer(): any;
    set normalize(arg: boolean);
    get normalize(): boolean;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
