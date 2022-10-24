export default SpatialPannerNode;
declare class SpatialPannerNode extends AudioNode {
    constructor(context: any, opts: any);
    _impl: impl.SpatialPannerNode;
    set panningModel(arg: string);
    get panningModel(): string;
    get positionX(): any;
    get positionY(): any;
    get positionZ(): any;
    get orientationX(): any;
    get orientationY(): any;
    get orientationZ(): any;
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
}
import AudioNode from "./AudioNode";
import * as impl from "../impl";
