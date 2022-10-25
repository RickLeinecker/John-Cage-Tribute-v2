'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/AudioListener', () => {
  it('context.listener', () => {
    const context = new AudioContext();
    const target = context.listener;

    expect(target instanceof api.AudioListener).toBeTruthy();
  });

  describe('methods', () => {
    it('.setPosition(x, y, z)', () => {
      const context = new AudioContext();
      const target = context.listener;
      const x = 0;
      const y = 1;
      const z = 2;

      target._impl.setPosition = jest.fn();

      target.setPosition(x, y, z);
      expect(target._impl.setPosition).toHaveBeenCalledTimes(1);
      expect(target._impl.setPosition.mock.calls[0][0]).toBe(x);
      expect(target._impl.setPosition.mock.calls[0][1]).toBe(y);
      expect(target._impl.setPosition.mock.calls[0][2]).toBe(z);
    });

    it('.setOrientation(x, y, z, xUp, yUp, zUp)', () => {
      const context = new AudioContext();
      const target = context.listener;
      const x = 0;
      const y = 1;
      const z = 2;
      const xUp = 3;
      const yUp = 4;
      const zUp = 5;

      target._impl.setOrientation = jest.fn();

      target.setOrientation(x, y, z, xUp, yUp, zUp);
      expect(target._impl.setOrientation).toHaveBeenCalledTimes(1);
      expect(target._impl.setOrientation.mock.calls[0][0]).toBe(x);
      expect(target._impl.setOrientation.mock.calls[0][1]).toBe(y);
      expect(target._impl.setOrientation.mock.calls[0][2]).toBe(z);
      expect(target._impl.setOrientation.mock.calls[0][3]).toBe(xUp);
      expect(target._impl.setOrientation.mock.calls[0][4]).toBe(yUp);
      expect(target._impl.setOrientation.mock.calls[0][5]).toBe(zUp);
    });
  });
});
