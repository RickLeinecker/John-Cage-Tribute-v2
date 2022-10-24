'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/OscillatorNode', () => {
  it('context.createOscillator()', () => {
    const context = new AudioContext();
    const target = context.createOscillator();

    expect(target instanceof api.OscillatorNode).toBeTruthy();
    expect(target instanceof api.AudioScheduledSourceNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.type=', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const type1 = 'sine';
      const type2 = 'sawtooth';

      target._impl.getType = jest.fn(() => type1);
      target._impl.setType = jest.fn();

      expect(target.type).toBe(type1);
      expect(target._impl.getType).toHaveBeenCalledTimes(1);

      target.type = type2;
      expect(target._impl.setType).toHaveBeenCalledTimes(1);
      expect(target._impl.setType.mock.calls[0][0]).toBe(type2);
    });

    it('.frequency', () => {
      const context = new AudioContext();
      const target = context.createOscillator();

      expect(target.frequency instanceof AudioParam).toBeTruthy();
      expect(target.frequency).toBe(target._impl.$frequency);
    });

    it('.detune', () => {
      const context = new AudioContext();
      const target = context.createOscillator();

      expect(target.detune instanceof AudioParam).toBeTruthy();
      expect(target.detune).toBe(target._impl.$detune);
    });

    it('.onended=', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();
      const event = { type: 'ended' };

      target.onended = callback1;
      target.onended = callback2;
      target.addEventListener('ended', callback3);
      target._impl.dispatchEvent(event);

      expect(target.onended).toBe(callback2);
      expect(callback1).toHaveBeenCalledTimes(0);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
      expect(callback2.mock.calls[0][0]).toBe(event);
      expect(callback3.mock.calls[0][0]).toBe(event);
    });
  });

  describe('methods', () => {
    it('.start(when)', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const when = 0;

      target._impl.start = jest.fn();

      target.start(when);
      expect(target._impl.start).toHaveBeenCalledTimes(1);
      expect(target._impl.start.mock.calls[0][0]).toBe(when);
    });

    it('.stop(when)', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const when = 0;

      target._impl.stop = jest.fn();

      target.stop(when);
      expect(target._impl.stop).toHaveBeenCalledTimes(1);
      expect(target._impl.stop.mock.calls[0][0]).toBe(when);
    });

    it('.setPeriodicWave(periodicWave)', () => {
      const context = new AudioContext();
      const target = context.createOscillator();
      const real = new Float32Array(16);
      const imag = new Float32Array(16);
      const periodicWave = context.createPeriodicWave(real, imag);

      target._impl.setPeriodicWave = jest.fn();

      target.setPeriodicWave(periodicWave);
      expect(target._impl.setPeriodicWave).toHaveBeenCalledTimes(1);
      expect(target._impl.setPeriodicWave.mock.calls[0][0]).toBe(periodicWave);
    });
  });
});
