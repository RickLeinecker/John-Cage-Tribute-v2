'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/GainNode', () => {
  it('context.createGain()', () => {
    const context = new AudioContext();
    const target = context.createGain();

    expect(target instanceof api.GainNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.gain', () => {
      const context = new AudioContext();
      const target = context.createGain();

      expect(target.gain instanceof AudioParam).toBeTruthy();
      expect(target.gain).toBe(target._impl.$gain);
    });
  });
});
