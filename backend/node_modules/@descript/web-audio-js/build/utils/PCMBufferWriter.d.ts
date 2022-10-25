export default PCMBufferWriter;
declare class PCMBufferWriter {
    constructor(buffer: any);
    _buffer: any;
    _pos: number;
    pcm8(value: any): void;
    pcm16(value: any): void;
    pcm32(value: any): void;
    pcm32f(value: any): void;
}
