'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/StereoPannerNode', () => {
  it('context.createStereoPanner()', () => {
    const context = new AudioContext();
    const target = context.createStereoPanner();

    expect(target instanceof api.StereoPannerNode).toBeTruthy();
  });

  describe('atrributes', () => {
    it('.pan', () => {
      const context = new AudioContext();
      const target = context.createStereoPanner();

      expect(target.pan instanceof AudioParam).toBeTruthy();
      expect(target.pan).toBe(target._impl.$pan);
    });
  });
});
