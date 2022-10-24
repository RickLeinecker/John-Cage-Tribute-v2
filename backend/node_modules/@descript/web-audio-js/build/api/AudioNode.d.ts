export default AudioNode;
declare class AudioNode extends EventTarget {
    constructor(context: any);
    get context(): any;
    get numberOfInputs(): any;
    get numberOfOutputs(): any;
    set channelCount(arg: any);
    get channelCount(): any;
    set channelCountMode(arg: any);
    get channelCountMode(): any;
    set channelInterpretation(arg: any);
    get channelInterpretation(): any;
    connect(destination: any, input: any, output: any): AudioNode | undefined;
    disconnect(...args: any[]): void;
}
import EventTarget from "./EventTarget";
