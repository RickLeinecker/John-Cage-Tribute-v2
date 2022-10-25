export default AudioBufferSourceNode;
declare class AudioBufferSourceNode extends AudioScheduledSourceNode {
    constructor(context: any, opts: any);
    _impl: impl.AudioBufferSourceNode;
    set buffer(arg: any);
    get buffer(): any;
    get playbackRate(): any;
    get detune(): any;
    set loop(arg: boolean);
    get loop(): boolean;
    set loopStart(arg: number);
    get loopStart(): number;
    set loopEnd(arg: number);
    get loopEnd(): number;
    start(when: any, offset: any, duration: any): void;
}
import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
import * as impl from "../impl";
