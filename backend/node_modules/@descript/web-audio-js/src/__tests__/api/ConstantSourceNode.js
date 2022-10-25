'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/ConstantSourceNode', () => {
  it('context.createConstantSource()', () => {
    const context = new AudioContext();
    const target = context.createConstantSource();

    expect(target instanceof api.ConstantSourceNode).toBeTruthy();
    expect(target instanceof api.AudioScheduledSourceNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.offset=', () => {
      const context = new AudioContext();
      const target = context.createConstantSource();

      expect(target.offset instanceof AudioParam).toBeTruthy();
      expect(target.offset).toBe(target._impl.$offset);
    });
  });
});
