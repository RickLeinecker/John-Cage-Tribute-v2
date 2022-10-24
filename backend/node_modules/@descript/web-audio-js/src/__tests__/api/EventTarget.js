'use strict';

import AudioContext from '../../api/BaseAudioContext';

describe('api/EventTarget', () => {
  describe('methods', () => {
    it('.addEventListener(type, listener)', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const type = 'ended';
      const listener = () => {};

      target._impl.addEventListener = jest.fn();

      target.addEventListener(type, listener);
      expect(target._impl.addEventListener).toHaveBeenCalledTimes(1);
      expect(target._impl.addEventListener.mock.calls[0][0]).toBe(type);
      expect(target._impl.addEventListener.mock.calls[0][1]).toBe(listener);
    });

    it('.removeEventListener()', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const type = 'ended';
      const listener = jest.fn();

      target._impl.removeEventListener = jest.fn();

      target.removeEventListener(type, listener);
      expect(target._impl.removeEventListener).toHaveBeenCalledTimes(1);
      expect(target._impl.removeEventListener.mock.calls[0][0]).toBe(type);
      expect(target._impl.removeEventListener.mock.calls[0][1]).toBe(listener);
    });
  });
});
