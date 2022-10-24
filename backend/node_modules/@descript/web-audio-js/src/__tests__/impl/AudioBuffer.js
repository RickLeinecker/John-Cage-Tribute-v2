'use strict';

import * as np from '../../__tests_helpers/np';
import AudioBuffer from '../../impl/AudioBuffer';
import AudioData from '../../impl/core/AudioData';

const numberOfChannels = 2,
  length = 32,
  sampleRate = 8000;

describe('impl/AudioBuffer', () => {
  it('constructor', () => {
    const node = new AudioBuffer({ numberOfChannels, length, sampleRate });

    expect(node instanceof AudioBuffer).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfChannels', () => {
      const node = new AudioBuffer({ numberOfChannels, length, sampleRate });

      expect(node.getNumberOfChannels()).toBe(numberOfChannels);
    });

    it('.length', () => {
      const node = new AudioBuffer({ numberOfChannels, length, sampleRate });

      expect(node.getLength()).toBe(length);
    });

    it('.sampleRate', () => {
      const node = new AudioBuffer({ numberOfChannels, length, sampleRate });

      expect(node.getSampleRate()).toBe(sampleRate);
    });

    it('.duration', () => {
      const node = new AudioBuffer({ numberOfChannels, length, sampleRate });

      expect(node.getDuration()).toBe(length / sampleRate);
    });

    it('.audioData', () => {
      const buffer = new AudioBuffer({ numberOfChannels, length, sampleRate });

      expect(buffer.audioData instanceof AudioData).toBeTruthy();
      expect(buffer.audioData.sampleRate).toBe(buffer.getSampleRate());
      expect(buffer.audioData.length).toBe(buffer.getLength());
      expect(buffer.audioData.numberOfChannels).toBe(
        buffer.getNumberOfChannels(),
      );
    });
  });

  describe('methods', () => {
    it('.copyFromChannel(destination, channelNumber, startInChannel)', () => {
      const buffer = new AudioBuffer({ numberOfChannels, length, sampleRate });
      const destination = new Float32Array(8);

      buffer.getChannelData(0).set(np.random_sample(32));
      buffer.getChannelData(1).set(np.random_sample(32));

      buffer.copyFromChannel(destination, 1, 4);
      expect(destination).toEqual(buffer.getChannelData(1).subarray(4, 12));
    });

    it('.copyToChannel(source, channelNumber, startInChannel)', () => {
      const buffer = new AudioBuffer({ numberOfChannels, length, sampleRate });
      const source = np.random_sample(8);

      buffer.getChannelData(0).set(np.random_sample(32));
      buffer.getChannelData(1).set(np.random_sample(32));

      buffer.copyToChannel(source, 0, 20);
      expect(source).toEqual(buffer.getChannelData(0).subarray(20, 28));
    });
  });
});
