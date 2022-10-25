'use strict';

import AudioContext from '../../api/BaseAudioContext';

describe('api/AudioParam', () => {
  describe('attributes', () => {
    it('.value=', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const value1 = 1;
      const value2 = 0.5;

      target._impl.getValue = jest.fn(() => value1);
      target._impl.setValue = jest.fn();

      expect(target.value).toBe(value1);
      expect(target._impl.getValue).toHaveBeenCalledTimes(1);

      target.value = value2;
      expect(target._impl.setValue).toHaveBeenCalledTimes(1);
      expect(target._impl.setValue.mock.calls[0][0]).toBe(value2);
    });

    it('.defaultValue', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const defaultValue = 1;

      target._impl.getDefaultValue = jest.fn(() => defaultValue);

      expect(target.defaultValue).toBe(defaultValue);
      expect(target._impl.getDefaultValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('methods', () => {
    it('.setValueAtTime(value, startTime)', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const value = 0;
      const startTime = 0.5;

      target._impl.setValueAtTime = jest.fn();

      target.setValueAtTime(value, startTime);
      expect(target._impl.setValueAtTime).toHaveBeenCalledTimes(1);
      expect(target._impl.setValueAtTime.mock.calls[0][0]).toBe(value);
      expect(target._impl.setValueAtTime.mock.calls[0][1]).toBe(startTime);
    });

    it('.linearRampToValueAtTime(value, endTime)', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const value = 0;
      const endTime = 0.5;

      target._impl.linearRampToValueAtTime = jest.fn();

      target.linearRampToValueAtTime(value, endTime);
      expect(target._impl.linearRampToValueAtTime).toHaveBeenCalledTimes(1);
      expect(target._impl.linearRampToValueAtTime.mock.calls[0][0]).toBe(value);
      expect(target._impl.linearRampToValueAtTime.mock.calls[0][1]).toBe(
        endTime,
      );
    });

    it('.exponentialRampToValueAtTime(value, endTime)', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const value = 0;
      const endTime = 0.5;

      target._impl.exponentialRampToValueAtTime = jest.fn();

      target.exponentialRampToValueAtTime(value, endTime);
      expect(target._impl.exponentialRampToValueAtTime).toHaveBeenCalledTimes(
        1,
      );
      expect(target._impl.exponentialRampToValueAtTime.mock.calls[0][0]).toBe(
        value,
      );
      expect(target._impl.exponentialRampToValueAtTime.mock.calls[0][1]).toBe(
        endTime,
      );
    });

    it('.setTargetAtTime(target, startTime, timeConstant)', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const targetValue = 0;
      const startTime = 0.5;
      const timeConstant = 2;

      target._impl.setTargetAtTime = jest.fn();

      target.setTargetAtTime(targetValue, startTime, timeConstant);
      expect(target._impl.setTargetAtTime).toHaveBeenCalledTimes(1);
      expect(target._impl.setTargetAtTime.mock.calls[0][0]).toBe(targetValue);
      expect(target._impl.setTargetAtTime.mock.calls[0][1]).toBe(startTime);
      expect(target._impl.setTargetAtTime.mock.calls[0][2]).toBe(timeConstant);
    });

    it('.setValueCurveAtTime(values, startTime, duration)', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const values = new Float32Array(128);
      const startTime = 0.5;
      const duration = 2;

      target._impl.setValueCurveAtTime = jest.fn();

      target.setValueCurveAtTime(values, startTime, duration);
      expect(target._impl.setValueCurveAtTime).toHaveBeenCalledTimes(1);
      expect(target._impl.setValueCurveAtTime.mock.calls[0][0]).toBe(values);
      expect(target._impl.setValueCurveAtTime.mock.calls[0][1]).toBe(startTime);
      expect(target._impl.setValueCurveAtTime.mock.calls[0][2]).toBe(duration);
    });

    it('.cancelScheduledValues(startTime)', () => {
      const context = new AudioContext();
      const target = context.createGain().gain;
      const startTime = 0.5;

      target._impl.cancelScheduledValues = jest.fn();

      target.cancelScheduledValues(startTime);
      expect(target._impl.cancelScheduledValues).toHaveBeenCalledTimes(1);
      expect(target._impl.cancelScheduledValues.mock.calls[0][0]).toBe(
        startTime,
      );
    });
  });
});
