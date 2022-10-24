'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/DynamicsCompressorNode', () => {
  it('context.createDynamicsCompressor()', () => {
    const context = new AudioContext();
    const target = context.createDynamicsCompressor();

    expect(target instanceof api.DynamicsCompressorNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.threshold', () => {
      const context = new AudioContext();
      const target = context.createDynamicsCompressor();

      expect(target.threshold instanceof AudioParam).toBeTruthy();
      expect(target.threshold).toBe(target._impl.$threshold);
    });

    it('.knee', () => {
      const context = new AudioContext();
      const target = context.createDynamicsCompressor();

      expect(target.knee instanceof AudioParam).toBeTruthy();
      expect(target.knee).toBe(target._impl.$knee);
    });

    it('.ratio', () => {
      const context = new AudioContext();
      const target = context.createDynamicsCompressor();

      expect(target.ratio instanceof AudioParam).toBeTruthy();
      expect(target.ratio).toBe(target._impl.$ratio);
    });

    it('.reduction', () => {
      const context = new AudioContext();
      const target = context.createDynamicsCompressor();
      const reduction = 0;

      target._impl.getReduction = jest.fn(() => reduction);

      expect(target.reduction).toBe(reduction);
      expect(target._impl.getReduction).toHaveBeenCalledTimes(1);
    });

    it('.attack', () => {
      const context = new AudioContext();
      const target = context.createDynamicsCompressor();

      expect(target.attack instanceof AudioParam).toBeTruthy();
      expect(target.attack).toBe(target._impl.$attack);
    });

    it('.release', () => {
      const context = new AudioContext();
      const target = context.createDynamicsCompressor();

      expect(target.release instanceof AudioParam).toBeTruthy();
      expect(target.release).toBe(target._impl.$release);
    });
  });
});
