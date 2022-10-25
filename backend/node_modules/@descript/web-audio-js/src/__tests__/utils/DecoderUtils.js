'use strict';

import * as DecoderUtils from '../../utils/DecoderUtils';

describe('utils/DecoderUtils.decode(decodeFn: function, audioData: arrayBuffer, opts?: object): Promise<AudioData>', () => {
  it('should return promise and resolve - without resampling', async () => {
    const source = new Uint8Array(128);
    const sampleRate = 44100;
    const channelData = [new Float32Array(128), new Float32Array(128)];
    const decodeFn = jest
      .fn()
      .mockReturnValue(Promise.resolve({ sampleRate, channelData }));

    const audioData = await DecoderUtils.decode(decodeFn, source);
    expect(decodeFn).toHaveBeenCalledTimes(1);
    expect(decodeFn).toBeCalledWith(source, {});
    expect(audioData.sampleRate).toBe(44100);
    expect(audioData.channelData).toBe(channelData);
  });

  it('should return promise and resolve - resampling', async () => {
    const source = new Uint8Array(128);
    const sampleRate = 44100;
    const channelData = [new Float32Array(128), new Float32Array(128)];
    const decodeFn = jest
      .fn()
      .mockReturnValue(Promise.resolve({ sampleRate, channelData }));

    const audioData = await DecoderUtils.decode(decodeFn, source, {
      sampleRate: 22050,
    });
    expect(decodeFn).toHaveBeenCalledTimes(1);
    expect(decodeFn).toBeCalledWith(source, { sampleRate: 22050 });
    expect(audioData.sampleRate).toBe(22050);
    expect(audioData.length).toBe(channelData[0].length / 2);
  });

  it('should reject if provided invalid data', async () => {
    const source = new Uint8Array(128);
    const decodeFn = jest.fn().mockReturnValue(Promise.reject('ERROR!'));

    await expect(
      DecoderUtils.decode(decodeFn, source, { sampleRate: 44100 }),
    ).rejects.toBe('ERROR!');
    expect(decodeFn).toHaveBeenCalledTimes(1);
    expect(decodeFn).toBeCalledWith(source, { sampleRate: 44100 });
  });

  it('should reject if invalid return', async () => {
    const source = new Uint8Array(128);
    const decodeFn = jest.fn().mockReturnValue(Promise.resolve(null));

    await expect(
      DecoderUtils.decode(decodeFn, source, { sampleRate: 44100 }),
    ).rejects.toBeInstanceOf(TypeError);
    expect(decodeFn).toHaveBeenCalledTimes(1);
    expect(decodeFn).toBeCalledWith(source, { sampleRate: 44100 });
  });
});

describe('utils/DecoderUtils.resample(audioData: AudioData, sampleRate: number): AudioData', () => {
  it('works', () => {
    const source = {
      sampleRate: 8000,
      channelData: [new Float32Array(128)],
    };
    const resampled = DecoderUtils.resample(source, 16000);

    expect(resampled.numberOfChannels).toBe(1);
    expect(resampled.length).toBe(256);
    expect(resampled.sampleRate).toBe(16000);
    expect(resampled.channelData.length).toBe(resampled.numberOfChannels);
    expect(resampled.channelData[0].length).toBe(resampled.length);
  });

  it('nothing to do', () => {
    const source = {
      sampleRate: 8000,
      channelData: [new Float32Array(128)],
    };
    const resampled = DecoderUtils.resample(source, 8000);

    expect(resampled).toBe(source);
  });
});
