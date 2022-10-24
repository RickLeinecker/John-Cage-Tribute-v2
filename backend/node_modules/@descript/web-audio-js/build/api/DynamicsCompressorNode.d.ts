export default DynamicsCompressorNode;
declare class DynamicsCompressorNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.DynamicsCompressorNode;
    get threshold(): any;
    get knee(): any;
    get ratio(): any;
    get reduction(): number;
    get attack(): any;
    get release(): any;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
