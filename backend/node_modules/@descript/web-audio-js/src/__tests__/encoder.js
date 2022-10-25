'use strict';

import * as encoder from '../encoder';
import * as EncoderUtils from '../utils/EncoderUtils';

describe('encoder', () => {
  let defaultWavEncoder, EncoderUtils$encode;

  beforeAll(() => {
    defaultWavEncoder = encoder.get('wav');
    EncoderUtils$encode = EncoderUtils.encode;
    EncoderUtils.encode = jest.fn(EncoderUtils.encode);
  });
  afterEach(() => {
    encoder.set('wav', defaultWavEncoder);
    EncoderUtils.encode.mockClear();
  });
  afterAll(() => {
    EncoderUtils.encode = EncoderUtils$encode;
  });

  it('.get(type: string): function', () => {
    const encodeFn1 = encoder.get('wav');
    const encodeFn2 = encoder.get('unknown');

    expect(typeof encodeFn1).toBe('function');
    expect(typeof encodeFn2).not.toBe('function');
  });

  it('.set(type: string, fn: function)', () => {
    const encodeFn1 = jest.fn();

    encoder.set('spy', encodeFn1);

    expect(encoder.get('spy')).toBe(encodeFn1);
  });

  it('.encode(audioData: object, opts?: object): Promise<ArrayBuffer>', () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];
    const audioData = { sampleRate: 44100, channelData: channelData };
    const encodeFn = jest.fn(() => {
      return Promise.resolve(new Uint8Array(64).buffer);
    });
    const opts = {};

    encoder.set('wav', encodeFn);

    return encoder.encode(audioData, opts).then((arrayBuffer) => {
      expect(encodeFn).toHaveBeenCalledTimes(1);
      expect(encodeFn).toBeCalledWith(audioData, opts);
      expect(EncoderUtils.encode).toHaveBeenCalledTimes(1);
      expect(EncoderUtils.encode).toBeCalledWith(encodeFn, audioData, opts);
      expect(arrayBuffer instanceof ArrayBuffer).toBeTruthy();
    });
  });

  it('.encode(audioData: object, opts?: object): Promise<ArrayBuffer> - failed', () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];
    const audioData = { sampleRate: 44100, channelData: channelData };
    const opts = { type: 'mid' };

    return encoder.encode(audioData, opts).catch((err) => {
      expect(err instanceof TypeError).toBeTruthy();
    });
  });
});
