export default PannerNode;
declare class PannerNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.PannerNode;
    set panningModel(arg: string);
    get panningModel(): string;
    set distanceModel(arg: string);
    get distanceModel(): string;
    set refDistance(arg: number);
    get refDistance(): number;
    set maxDistance(arg: number);
    get maxDistance(): number;
    set rolloffFactor(arg: number);
    get rolloffFactor(): number;
    set coneInnerAngle(arg: number);
    get coneInnerAngle(): number;
    set coneOuterAngle(arg: number);
    get coneOuterAngle(): number;
    set coneOuterGain(arg: number);
    get coneOuterGain(): number;
    setPosition(x: any, y: any, z: any): void;
    setOrientation(x: any, y: any, z: any): void;
    setVelocity(x: any, y: any, z: any): void;
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
