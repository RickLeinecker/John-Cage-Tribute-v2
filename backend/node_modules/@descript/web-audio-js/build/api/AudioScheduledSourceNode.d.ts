export default AudioScheduledSourceNode;
declare class AudioScheduledSourceNode extends AudioNode {
    constructor(context: any);
    set onended(arg: any);
    get onended(): any;
    /**
     *
     * @param {number} when
     * @param {number} [offset]
     * @param {number} [duration]
     */
    start(when: number, offset?: number | undefined, duration?: number | undefined): void;
    stop(when: any): void;
}
import AudioNode from "./AudioNode";
