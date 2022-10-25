'use strict';

import * as decoder from '../decoder';
import * as DecoderUtils from '../utils/DecoderUtils';
import AudioBuffer from '../api/AudioBuffer';

describe('decoder', () => {
  let defaultWavDecoder;
  let DecoderUtils$decodeSpy;

  beforeAll(() => {
    defaultWavDecoder = decoder.get('wav');
    DecoderUtils$decodeSpy = jest.spyOn(DecoderUtils, 'decode');
  });
  afterEach(() => {
    decoder.set('wav', defaultWavDecoder);
  });
  afterAll(() => {
    DecoderUtils$decodeSpy.mockRestore();
  });

  it('.get(type: string): function', () => {
    const decodeFn1 = decoder.get('wav');
    const decodeFn2 = decoder.get('unknown');

    expect(typeof decodeFn1).toBe('function');
    expect(typeof decodeFn2).not.toBe('function');
  });

  it('.set(type: string, fn: function)', () => {
    const decodeFn1 = jest.fn();

    decoder.set('spy', decodeFn1);

    expect(decoder.get('spy')).toBe(decodeFn1);
  });

  it('.decode(audioData: ArrayBuffer, opts?:object): Promise<AudioBuffer>', async () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];
    const decodeFn = jest.fn(() => {
      return Promise.resolve({ sampleRate: 44100, channelData: channelData });
    });
    const audioData = new Uint32Array([
      0x46464952,
      0x0000002c,
      0x45564157,
      0x20746d66,
      0x00000010,
      0x00020001,
      0x0000ac44,
      0x0002b110,
      0x00100004,
      0x61746164,
      0x00000008,
      0x8000c000,
      0x3fff7fff,
    ]).buffer;
    const opts = {};

    decoder.set('wav', decodeFn);

    const audioBuffer = await decoder.decode(audioData, opts);
    expect(decodeFn).toHaveBeenCalledTimes(1);
    expect(decodeFn).toHaveBeenCalledWith(audioData, opts);
    expect(DecoderUtils$decodeSpy).toHaveBeenCalledTimes(1);
    expect(DecoderUtils$decodeSpy).toHaveBeenCalledWith(
      decodeFn,
      audioData,
      opts,
    );
    expect(audioBuffer instanceof AudioBuffer).toBeTruthy();
    expect(audioBuffer.numberOfChannels).toBe(2);
    expect(audioBuffer.length).toBe(16);
    expect(audioBuffer.sampleRate).toBe(44100);
    expect(audioBuffer.getChannelData(0)).toBe(channelData[0]);
    expect(audioBuffer.getChannelData(1)).toBe(channelData[1]);
  });

  it('.decode(audioData: ArrayBuffer, opts?:object): Promise<AudioBuffer> - not supported', async () => {
    const audioData = new Uint8Array(16).buffer;

    await expect(decoder.decode(audioData)).rejects.toBeInstanceOf(TypeError);
  });
});
