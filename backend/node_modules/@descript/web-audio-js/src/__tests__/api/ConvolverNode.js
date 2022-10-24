'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/ConvolverNode', () => {
  it('context.createConvolver()', () => {
    const context = new AudioContext();
    const target = context.createConvolver();

    expect(target instanceof api.ConvolverNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.buffer=', () => {
      const context = new AudioContext();
      const target = context.createConvolver();
      const buffer = context.createBuffer(1, 16, 8000);

      target._impl.setBuffer = jest.fn();

      target.buffer = buffer;
      expect(target.buffer).toBe(buffer);
      expect(target._impl.setBuffer).toHaveBeenCalledTimes(1);
      expect(target._impl.setBuffer.mock.calls[0][0]).toBe(buffer);
    });

    it('.normalize=', () => {
      const context = new AudioContext();
      const target = context.createConvolver();
      const normalize1 = true;
      const normalize2 = false;

      target._impl.getNormalize = jest.fn(() => normalize1);
      target._impl.setNormalize = jest.fn();

      expect(target.normalize).toBe(normalize1);
      expect(target._impl.getNormalize).toHaveBeenCalledTimes(1);

      target.normalize = normalize2;
      expect(target._impl.setNormalize).toHaveBeenCalledTimes(1);
      expect(target._impl.setNormalize.mock.calls[0][0]).toBe(normalize2);
    });
  });
});
