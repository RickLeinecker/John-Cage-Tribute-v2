'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/BiquadFilterNode', () => {
  it('context.createBiquadFilter()', () => {
    const context = new AudioContext();
    const target = context.createBiquadFilter();

    expect(target instanceof api.BiquadFilterNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.type=', () => {
      const context = new AudioContext();
      const target = context.createBiquadFilter();
      const type1 = 'lowpass';
      const type2 = 'highpass';

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
      const target = context.createBiquadFilter();

      expect(target.frequency instanceof AudioParam).toBeTruthy();
      expect(target.frequency).toBe(target._impl.$frequency);
    });

    it('.detune', () => {
      const context = new AudioContext();
      const target = context.createBiquadFilter();

      expect(target.detune instanceof AudioParam).toBeTruthy();
      expect(target.detune).toBe(target._impl.$detune);
    });

    it('.Q', () => {
      const context = new AudioContext();
      const target = context.createBiquadFilter();

      expect(target.Q instanceof AudioParam).toBeTruthy();
      expect(target.Q).toBe(target._impl.$Q);
    });

    it('.gain', () => {
      const context = new AudioContext();
      const target = context.createBiquadFilter();

      expect(target.gain instanceof AudioParam).toBeTruthy();
      expect(target.gain).toBe(target._impl.$gain);
    });
  });

  describe('methods', () => {
    it('.getFrequencyResponse(frequencyHz, magResponse, phaseResponse)', () => {
      const context = new AudioContext();
      const target = context.createBiquadFilter();
      const frequencyHz = new Float32Array(128);
      const magResponse = new Float32Array(128);
      const phaseResponse = new Float32Array(128);

      target._impl.getFrequencyResponse = jest.fn();

      target.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
      expect(target._impl.getFrequencyResponse).toHaveBeenCalledTimes(1);
      expect(target._impl.getFrequencyResponse.mock.calls[0][0]).toBe(
        frequencyHz,
      );
      expect(target._impl.getFrequencyResponse.mock.calls[0][1]).toBe(
        magResponse,
      );
      expect(target._impl.getFrequencyResponse.mock.calls[0][2]).toBe(
        phaseResponse,
      );
    });
  });
});
