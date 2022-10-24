'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/AudioBufferSourceNode', () => {
  it('context.createBufferSource()', () => {
    const context = new AudioContext();
    const target = context.createBufferSource();

    expect(target instanceof api.AudioBufferSourceNode).toBeTruthy();
    expect(target instanceof api.AudioScheduledSourceNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.buffer=', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
      const buffer = context.createBuffer(1, 16, 8000);

      target._impl.setBuffer = jest.fn();

      target.buffer = buffer;
      expect(target.buffer).toBe(buffer);
      expect(target._impl.setBuffer).toHaveBeenCalledTimes(1);
      expect(target._impl.setBuffer.mock.calls[0][0]).toBe(buffer);
    });

    it('.playbackRate', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();

      expect(target.playbackRate instanceof AudioParam).toBeTruthy();
      expect(target.playbackRate).toBe(target._impl.$playbackRate);
    });

    it('.detune', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();

      expect(target.detune instanceof AudioParam).toBeTruthy();
      expect(target.detune).toBe(target._impl.$detune);
    });

    it('.loop=', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
      const loop1 = false;
      const loop2 = true;

      target._impl.getLoop = jest.fn(() => loop1);
      target._impl.setLoop = jest.fn();

      expect(target.loop).toBe(loop1);
      expect(target._impl.getLoop).toHaveBeenCalledTimes(1);

      target.loop = loop2;
      expect(target._impl.setLoop).toHaveBeenCalledTimes(1);
      expect(target._impl.setLoop.mock.calls[0][0]).toBe(loop2);
    });

    it('.loopStart=', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
      const loopStart1 = 0;
      const loopStart2 = 1;

      target._impl.getLoopStart = jest.fn(() => loopStart1);
      target._impl.setLoopStart = jest.fn();

      expect(target.loopStart).toBe(loopStart1);
      expect(target._impl.getLoopStart).toHaveBeenCalledTimes(1);

      target.loopStart = loopStart2;
      expect(target._impl.setLoopStart).toHaveBeenCalledTimes(1);
      expect(target._impl.setLoopStart.mock.calls[0][0]).toBe(loopStart2);
    });

    it('.loopEnd=', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
      const loopEnd1 = 0;
      const loopEnd2 = 1;

      target._impl.getLoopEnd = jest.fn(() => loopEnd1);
      target._impl.setLoopEnd = jest.fn();

      expect(target.loopEnd).toBe(loopEnd1);
      expect(target._impl.getLoopEnd).toHaveBeenCalledTimes(1);

      target.loopEnd = loopEnd2;
      expect(target._impl.setLoopEnd).toHaveBeenCalledTimes(1);
      expect(target._impl.setLoopEnd.mock.calls[0][0]).toBe(loopEnd2);
    });

    it('.onended=', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
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
    it('.start(when, offset, duration)', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
      const when = 0;
      const offset = 1;
      const duration = 2;

      target._impl.start = jest.fn();

      target.start(when, offset, duration);
      expect(target._impl.start).toHaveBeenCalledTimes(1);
      expect(target._impl.start.mock.calls[0][0]).toBe(when);
      expect(target._impl.start.mock.calls[0][1]).toBe(offset);
      expect(target._impl.start.mock.calls[0][2]).toBe(duration);
    });

    it('.stop(when)', () => {
      const context = new AudioContext();
      const target = context.createBufferSource();
      const when = 0;

      target._impl.stop = jest.fn();

      target.stop(when);
      expect(target._impl.stop).toHaveBeenCalledTimes(1);
      expect(target._impl.stop.mock.calls[0][0]).toBe(when);
    });
  });
});
