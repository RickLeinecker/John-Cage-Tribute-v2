import BaseAudioContext from '../api/BaseAudioContext';
import AudioContext from '../impl/AudioContext';
import AudioBuffer from '../api/AudioBuffer';
export declare class RawDataAudioContext extends BaseAudioContext {
    readonly _impl: AudioContext;
    readonly blockSize: number;
    readonly numberOfChannels: number;
    constructor({ sampleRate, blockSize, numberOfChannels, }?: {
        sampleRate?: number;
        blockSize?: number;
        numberOfChannels?: number;
    });
    suspend(): Promise<void>;
    createAudioBuffer(length: number, sampleRate: number, channels: Float32Array[]): AudioBuffer;
    process(channelBuffers: Float32Array[], offset?: number): void;
}
