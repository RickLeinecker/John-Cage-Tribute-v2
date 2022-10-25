'use strict';

import * as np from '../../../__tests_helpers/np';
import AudioBus from '../../../impl/core/AudioBus';
import AudioData from '../../../impl/core/AudioData';
import { DISCRETE, SPEAKERS } from '../../../constants/ChannelInterpretation';

describe('impl/core/AudioBus', () => {
  it('constructor(numberOfChannels, length, sampleRate)', () => {
    const bus = new AudioBus(2, 128, 44100);

    expect(bus instanceof AudioBus).toBeTruthy();
  });

  describe('attributes', () => {
    it('.channelInterpretation=', () => {
      const bus = new AudioBus(2, 128, 44100);

      expect(bus.getChannelInterpretation()).toBe(DISCRETE);

      bus.setChannelInterpretation(SPEAKERS);
      expect(bus.getChannelInterpretation()).toBe(SPEAKERS);
    });

    it('.numberOfChannels=', () => {
      const bus = new AudioBus(2, 128, 44100);

      expect(bus.getNumberOfChannels()).toBe(2);

      bus.setNumberOfChannels(4);
      expect(bus.getNumberOfChannels()).toBe(4);
    });

    it('.length', () => {
      const bus = new AudioBus(2, 128, 44100);

      expect(bus.getLength()).toBe(128);
    });

    it('.sampleRate', () => {
      const bus = new AudioBus(2, 128, 44100);

      expect(bus.getSampleRate()).toBe(44100);
    });

    it('.audioData', () => {
      const bus = new AudioBus(2, 128, 44100);
      const data = bus.audioData;

      expect(data instanceof AudioData).toBeTruthy();
    });
  });

  describe('methods', () => {
    it('.getChannelData()', () => {
      const bus = new AudioBus(2, 128, 44100);
      const channelData = bus.getChannelData();

      expect(bus.isSilent).toBe(true);
      expect(channelData).toBe(bus.getChannelData());
    });

    it('.getMutableData()', () => {
      const bus = new AudioBus(2, 128, 44100);
      const mutableData = bus.getMutableData();

      expect(bus.isSilent).toBe(false);
      expect(mutableData).toBe(bus.getChannelData());
    });

    it('.zeros()', () => {
      const bus = new AudioBus(2, 128, 44100);

      bus.getMutableData()[0].set(np.random_sample(128));
      bus.getMutableData()[1].set(np.random_sample(128));

      bus.zeros();

      expect(bus.getChannelData()[0]).toEqual(np.zeros(128));
      expect(bus.getChannelData()[1]).toEqual(np.zeros(128));
      expect(bus.isSilent).toBe(true);
    });

    it('.copyFrom(bus)', () => {
      const bus1 = new AudioBus(1, 128, 44100);
      const bus2 = new AudioBus(1, 128, 44100);
      const noise1 = np.random_sample(128);
      const noise2 = np.random_sample(128);

      bus1.getMutableData()[0].set(noise1);
      bus2.getMutableData()[0].set(noise2);

      bus2.copyFrom(bus1);
      expect(bus2.getChannelData()[0]).toEqual(noise1);
      expect(bus2.isSilent).toBe(false);
    });

    it('.copyFrom(silentBus)', () => {
      const bus1 = new AudioBus(1, 128, 44100);
      const bus2 = new AudioBus(1, 128, 44100);
      const noise1 = np.random_sample(128);
      const noise2 = np.random_sample(128);

      bus1.getMutableData()[0].set(noise1);
      bus2.getMutableData()[0].set(noise2);

      bus1.zeros();
      bus2.copyFrom(bus1);
      expect(bus2.getChannelData()[0]).toEqual(np.zeros(128));
      expect(bus2.isSilent).toBeTruthy();
    });

    it('.copyFromWithOffset(bus, offset)', () => {
      const bus1 = new AudioBus(1, 128, 44100);
      const bus2 = new AudioBus(1, 128, 44100);
      const bus3 = new AudioBus(1, 256, 44100);
      const noise1 = np.random_sample(128);
      const noise2 = np.random_sample(128);
      const noise3 = np.random_sample(256);

      bus1.getMutableData()[0].set(noise1);
      bus2.getMutableData()[0].set(noise2);
      bus3.getMutableData()[0].set(noise3);

      bus3.copyFromWithOffset(bus1, 0);
      bus3.copyFromWithOffset(bus2, 128);
      expect(bus3.getChannelData()[0].subarray(0, 128)).toEqual(noise1);
      expect(bus3.getChannelData()[0].subarray(128, 256)).toEqual(noise2);
      expect(bus3.isSilent).toBe(false);
    });
  });
});
