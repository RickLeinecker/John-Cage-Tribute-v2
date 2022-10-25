export default PCMArrayBufferWriter;
declare class PCMArrayBufferWriter {
    constructor(buffer: any);
    _view: DataView;
    _pos: number;
    pcm8(value: any): void;
    pcm16(value: any): void;
    pcm32(value: any): void;
    pcm32f(value: any): void;
}
