'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/DelayNode', () => {
  it('context.createDelay(maxDelayTime)', () => {
    const context = new AudioContext();
    const target = context.createDelay(1);

    expect(target instanceof api.DelayNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.delayTime', () => {
      const context = new AudioContext();
      const target = context.createDelay();

      expect(target.delayTime instanceof AudioParam).toBeTruthy();
      expect(target.delayTime).toBe(target._impl.$delayTime);
    });
  });
});
