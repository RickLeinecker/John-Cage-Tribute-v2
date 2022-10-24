'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/WaveShaperNode', () => {
  it('context.createWaveShaper()', () => {
    const context = new AudioContext();
    const target = context.createWaveShaper();

    expect(target instanceof api.WaveShaperNode).toBeTruthy();
  });

  describe('atrributes', () => {
    it('.curve=', () => {
      const context = new AudioContext();
      const target = context.createWaveShaper();
      const curve1 = null;
      const curve2 = new Float32Array(128);

      target._impl.getCurve = jest.fn(() => curve1);
      target._impl.setCurve = jest.fn();

      expect(target.curve).toBe(curve1);
      expect(target._impl.getCurve).toHaveBeenCalledTimes(1);

      target.curve = curve2;
      expect(target._impl.setCurve).toHaveBeenCalledTimes(1);
      expect(target._impl.setCurve.mock.calls[0][0]).toBe(curve2);
    });

    it('.oversample=', () => {
      const context = new AudioContext();
      const target = context.createWaveShaper();
      const oversample1 = 'none';
      const oversample2 = '2x';

      target._impl.getOversample = jest.fn(() => oversample1);
      target._impl.setOversample = jest.fn();

      expect(target.oversample).toBe(oversample1);
      expect(target._impl.getOversample).toHaveBeenCalledTimes(1);

      target.oversample = oversample2;
      expect(target._impl.setOversample).toHaveBeenCalledTimes(1);
      expect(target._impl.setOversample.mock.calls[0][0]).toBe(oversample2);
    });
  });
});
