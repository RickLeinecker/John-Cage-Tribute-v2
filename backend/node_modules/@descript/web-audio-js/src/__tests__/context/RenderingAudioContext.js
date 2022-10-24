'use strict';

import RenderingAudioContext from '../../context/RenderingAudioContext';

describe('RenderingAudioContext', () => {
  it('should return a RenderingAudioContext instance', () => {
    const context = new RenderingAudioContext();

    expect(context instanceof RenderingAudioContext).toBeTruthy();
  });

  it('should return a RenderingAudioContext instance with options', () => {
    const context = new RenderingAudioContext({
      sampleRate: 8000,
      numberOfChannels: 1,
      blockSize: 256,
      bitDepth: 8,
    });

    expect(context instanceof RenderingAudioContext).toBeTruthy();
    expect(context.sampleRate).toBe(8000);
    expect(context.numberOfChannels).toBe(1);
    expect(context.blockSize).toBe(256);
    expect(context.format).toEqual({
      sampleRate: 8000,
      channels: 1,
      bitDepth: 8,
      float: false,
    });
  });

  it('should advance current time when rendered', () => {
    const context = new RenderingAudioContext();

    expect(context.currentTime).toBe(0);

    context.processTo('00:00:10.000');
    expect(context.currentTime | 0).toBe(10);

    context.processTo('00:00:15.000');
    expect(context.currentTime | 0).toBe(15);
  });

  it('should export AudioData', () => {
    const context = new RenderingAudioContext();

    context.processTo('00:00:10.000');

    const audioData = context.exportAsAudioData();

    expect(audioData.numberOfChannels).toBe(2);
    expect((audioData.length / audioData.sampleRate) | 0).toBe(10);
    expect(audioData.sampleRate).toBe(44100);
  });

  it('should encode AudioData', () => {
    const context = new RenderingAudioContext();

    const audioData = {
      sampleRate: 44100,
      channelData: [new Float32Array(16)],
    };

    return context.encodeAudioData(audioData).then((arrayBuffer) => {
      expect(arrayBuffer instanceof ArrayBuffer).toBeTruthy();
    });
  });
});
