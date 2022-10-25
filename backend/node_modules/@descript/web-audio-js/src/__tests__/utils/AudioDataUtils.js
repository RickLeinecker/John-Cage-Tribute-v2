'use strict';

import * as AudioDataUtils from '../../utils/AudioDataUtils';
import APIAudioBuffer from '../../api/AudioBuffer';
import IMPLAudioBuffer from '../../impl/AudioBuffer';

describe('utils/AudioDataUtils.isAudioData()', () => {
  it('true when .sampleRate is number and .channelData is Float32Array[]', () => {
    const data = { sampleRate: 8000, channelData: [new Float32Array(16)] };

    expect(AudioDataUtils.isAudioData(data)).toBeTruthy();
  });

  it('false when falsy value', () => {
    expect(AudioDataUtils.isAudioData(null)).toBe(false);
  });

  it('false when .sampleRate is not finte number', () => {
    const data = { sampleRate: '8000', channelData: [new Float32Array(16)] };

    expect(AudioDataUtils.isAudioData(data)).toBe(false);
  });

  it('false when .channelData is not Array', () => {
    const data = { sampleRate: 8000, channelData: {} };

    expect(AudioDataUtils.isAudioData(data)).toBe(false);
  });

  it('false when .channelData is not Float32Array[]', () => {
    const data = { sampleRate: 8000, channelData: [new Uint8Array(16)] };

    expect(AudioDataUtils.isAudioData(data)).toBe(false);
  });
});

describe('utils/AudioDataUtils.toAudioData()', () => {
  it('convert to full audioData from audioData', () => {
    const data = { sampleRate: 8000, channelData: [new Float32Array(16)] };
    const actual = AudioDataUtils.toAudioData(data);
    const expected = Object.assign({ numberOfChannels: 1, length: 16 }, data);

    expect(actual).not.toBe(expected);
    expect(actual).toEqual(expected);
  });

  it('convert to full audioData from audioData (channelData is empty)', () => {
    const data = { sampleRate: 8000, channelData: [] };
    const actual = AudioDataUtils.toAudioData(data);
    const expected = Object.assign({ numberOfChannels: 0, length: 0 }, data);

    expect(actual).not.toBe(expected);
    expect(actual).toEqual(expected);
  });

  it('convert to full audioData from audioBuffer', () => {
    const channelData = [new Float32Array(16)];
    const data = {
      numberOfChannels: 1,
      sampleRate: 8000,
      getChannelData(ch) {
        return channelData[ch];
      },
    };
    const actual = AudioDataUtils.toAudioData(data);
    const expected = {
      numberOfChannels: 1,
      length: 16,
      sampleRate: 8000,
      channelData,
    };

    expect(actual).toEqual(expected);
  });

  it('convert to full audioData from audioBuffer (channelData is empty)', () => {
    const channelData = [];
    const data = { numberOfChannels: 0, sampleRate: 8000, getChannelData() {} };
    const actual = AudioDataUtils.toAudioData(data);
    const expected = {
      numberOfChannels: 0,
      length: 0,
      sampleRate: 8000,
      channelData,
    };

    expect(actual).toEqual(expected);
  });

  it('convert to full audioData from null', () => {
    const actual = AudioDataUtils.toAudioData(null);
    const expected = {
      numberOfChannels: 0,
      length: 0,
      sampleRate: 0,
      channelData: [],
    };

    expect(actual).toEqual(expected);
  });
});

describe('utils/AudioDataUtils.isAudioBuffer()', () => {
  it('true when .numberOfChannels is number and .sampleRate is number and .getChannelData is function', () => {
    const channelData = [new Float32Array(16)];
    const data = {
      numberOfChannels: 1,
      sampleRate: 8000,
      getChannelData() {
        return channelData[0];
      },
    };

    expect(AudioDataUtils.isAudioBuffer(data)).toBeTruthy();
  });

  it('false when falsy value', () => {
    expect(AudioDataUtils.isAudioBuffer(null)).toBe(false);
  });

  it('false when .numberOfChannels is not number', () => {
    const channelData = [new Float32Array(16)];
    const data = {
      numberOfChannels: '1',
      sampleRate: 8000,
      getChannelData() {
        return channelData[0];
      },
    };

    expect(AudioDataUtils.isAudioBuffer(data)).toBe(false);
  });

  it('false when .sampleRate is not number', () => {
    const channelData = [new Float32Array(16)];
    const data = {
      numberOfChannels: 1,
      sampleRate: '8000',
      getChannelData() {
        return channelData[0];
      },
    };

    expect(AudioDataUtils.isAudioBuffer(data)).toBe(false);
  });

  it('false when .getChannelData is not function', () => {
    const data = {
      numberOfChannels: 1,
      sampleRate: 8000,
      getChannelData: null,
    };

    expect(AudioDataUtils.isAudioBuffer(data)).toBe(false);
  });
});

describe('utils/AudioDataUtils.toAudioBuffer()', () => {
  it('convert AudioBuffer from audioData - api', () => {
    const data = { sampleRate: 8000, channelData: [new Float32Array(16)] };
    const actual = AudioDataUtils.toAudioBuffer(data, APIAudioBuffer);

    expect(actual instanceof APIAudioBuffer).toBeTruthy();
    expect(actual.numberOfChannels).toBe(1);
    expect(actual.length).toBe(16);
    expect(actual.sampleRate).toBe(8000);
  });

  it('convert AudioBuffer from audioData - api', () => {
    const data = { sampleRate: 8000, channelData: [new Float32Array(16)] };
    const actual = AudioDataUtils.toAudioBuffer(data, IMPLAudioBuffer);

    expect(actual instanceof IMPLAudioBuffer).toBeTruthy();
    expect(actual.getNumberOfChannels()).toBe(1);
    expect(actual.getLength()).toBe(16);
    expect(actual.getSampleRate()).toBe(8000);
  });
});
