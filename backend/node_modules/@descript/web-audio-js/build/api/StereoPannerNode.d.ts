export default StereoPannerNode;
declare class StereoPannerNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.StereoPannerNode;
    get pan(): any;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
