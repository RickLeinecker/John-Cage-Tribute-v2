'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/AnalyserNode', () => {
  it('context.createAnalyser()', () => {
    const context = new AudioContext();
    const target = context.createAnalyser();

    expect(target instanceof api.AnalyserNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.fftSize=', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const fftSize1 = 1024;
      const fftSize2 = 512;

      target._impl.getFftSize = jest.fn(() => fftSize1);
      target._impl.setFftSize = jest.fn();

      expect(target.fftSize).toBe(fftSize1);
      expect(target._impl.getFftSize).toHaveBeenCalledTimes(1);

      target.fftSize = fftSize2;
      expect(target._impl.setFftSize).toHaveBeenCalledTimes(1);
      expect(target._impl.setFftSize.mock.calls[0][0]).toBe(fftSize2);
    });

    it('.frequencyBinCount', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const frequencyBinCount = 512;

      target._impl.getFrequencyBinCount = jest.fn(() => frequencyBinCount);

      expect(target.frequencyBinCount).toBe(frequencyBinCount);
      expect(target._impl.getFrequencyBinCount).toHaveBeenCalledTimes(1);
    });

    it('.minDecibels=', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const minDecibels1 = -30;
      const minDecibels2 = -20;

      target._impl.getMinDecibels = jest.fn(() => minDecibels1);
      target._impl.setMinDecibels = jest.fn();

      expect(target.minDecibels).toBe(minDecibels1);
      expect(target._impl.getMinDecibels).toHaveBeenCalledTimes(1);

      target.minDecibels = minDecibels2;
      expect(target._impl.setMinDecibels).toHaveBeenCalledTimes(1);
      expect(target._impl.setMinDecibels.mock.calls[0][0]).toBe(minDecibels2);
    });

    it('.maxDecibels=', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const maxDecibels1 = -100;
      const maxDecibels2 = -120;

      target._impl.getMaxDecibels = jest.fn(() => maxDecibels1);
      target._impl.setMaxDecibels = jest.fn();

      expect(target.maxDecibels).toBe(maxDecibels1);
      expect(target._impl.getMaxDecibels).toHaveBeenCalledTimes(1);

      target.maxDecibels = maxDecibels2;
      expect(target._impl.setMaxDecibels).toHaveBeenCalledTimes(1);
      expect(target._impl.setMaxDecibels.mock.calls[0][0]).toBe(maxDecibels2);
    });

    it('.smoothingTimeConstant=', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const smoothingTimeConstant1 = 0.8;
      const smoothingTimeConstant2 = 0.6;

      target._impl.getSmoothingTimeConstant = jest.fn(
        () => smoothingTimeConstant1,
      );
      target._impl.setSmoothingTimeConstant = jest.fn();

      expect(target.smoothingTimeConstant).toBe(smoothingTimeConstant1);
      expect(target._impl.getSmoothingTimeConstant).toHaveBeenCalledTimes(1);

      target.smoothingTimeConstant = smoothingTimeConstant2;
      expect(target._impl.setSmoothingTimeConstant).toHaveBeenCalledTimes(1);
      expect(target._impl.setSmoothingTimeConstant.mock.calls[0][0]).toBe(
        smoothingTimeConstant2,
      );
    });
  });

  describe('methods', () => {
    it('.getFloatFrequencyData(array)', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const array = new Float32Array(128);

      target._impl.getFloatFrequencyData = jest.fn();

      target.getFloatFrequencyData(array);
      expect(target._impl.getFloatFrequencyData).toHaveBeenCalledTimes(1);
      expect(target._impl.getFloatFrequencyData.mock.calls[0][0]).toBe(array);
    });

    it('.getByteFrequencyData(array)', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const array = new Uint8Array(128);

      target._impl.getByteFrequencyData = jest.fn();

      target.getByteFrequencyData(array);
      expect(target._impl.getByteFrequencyData).toHaveBeenCalledTimes(1);
      expect(target._impl.getByteFrequencyData.mock.calls[0][0]).toBe(array);
    });

    it('.getFloatTimeDomainData(array)', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const array = new Float32Array(128);

      target._impl.getFloatTimeDomainData = jest.fn();

      target.getFloatTimeDomainData(array);
      expect(target._impl.getFloatTimeDomainData).toHaveBeenCalledTimes(1);
      expect(target._impl.getFloatTimeDomainData.mock.calls[0][0]).toBe(array);
    });

    it('.getByteTimeDomainData(array)', () => {
      const context = new AudioContext();
      const target = context.createAnalyser();
      const array = new Uint8Array(128);

      target._impl.getByteTimeDomainData = jest.fn();

      target.getByteTimeDomainData(array);
      expect(target._impl.getByteTimeDomainData).toHaveBeenCalledTimes(1);
      expect(target._impl.getByteTimeDomainData.mock.calls[0][0]).toBe(array);
    });
  });
});
