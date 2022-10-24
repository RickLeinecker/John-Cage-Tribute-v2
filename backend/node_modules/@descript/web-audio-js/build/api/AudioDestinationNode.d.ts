export default AudioDestinationNode;
declare class AudioDestinationNode extends AudioNode {
    constructor(context: any, impl: any);
    _impl: any;
    get maxChannelCount(): any;
}
import AudioNode from "./AudioNode";
