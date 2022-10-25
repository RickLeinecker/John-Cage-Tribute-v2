export default OscillatorNode;
declare class OscillatorNode extends AudioScheduledSourceNode {
    constructor(context: any, opts: any);
    _impl: impl.OscillatorNode;
    set type(arg: string);
    get type(): string;
    get frequency(): any;
    get detune(): any;
    setPeriodicWave(periodicWave: any): void;
}
import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
import * as impl from "../impl";
