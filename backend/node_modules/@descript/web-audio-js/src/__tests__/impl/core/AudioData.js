'use strict';

import * as np from '../../../__tests_helpers/np';
import AudioData from '../../../impl/core/AudioData';

describe('impl/core/AudioData', () => {
  it('constructor(numberOfChannels, length, sampleRate)', () => {
    const data = new AudioData(2, 128, 44100);

    expect(data instanceof AudioData).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfChannels', () => {
      const data = new AudioData(2, 128, 44100);

      expect(data.numberOfChannels).toBe(2);
    });

    it('.length', () => {
      const data = new AudioData(2, 128, 44100);

      expect(data.length).toBe(128);
    });

    it('.sampleRate', () => {
      const data = new AudioData(2, 128, 44100);

      expect(data.sampleRate).toBe(44100);
    });

    it('.channelData', () => {
      const data = new AudioData(2, 128, 44100);

      expect(data.channelData.length).toBe(2);
      expect(data.channelData[0]).toEqual(np.zeros(128));
      expect(data.channelData[1]).toEqual(np.zeros(128));
    });
  });
});
