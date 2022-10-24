'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/ScriptProcessorNode', () => {
  it('context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels)', () => {
    const context = new AudioContext();
    const target = context.createScriptProcessor(256, 1, 1);

    expect(target instanceof api.ScriptProcessorNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.bufferSize', () => {
      const context = new AudioContext();
      const target = context.createScriptProcessor(256, 1, 1);
      const bufferSize = 256;

      target._impl.getBufferSize = jest.fn(() => bufferSize);

      expect(target.bufferSize).toBe(bufferSize);
      expect(target._impl.getBufferSize).toHaveBeenCalledTimes(1);
    });

    it('.onaudioprocess=', () => {
      const context = new AudioContext();
      const target = context.createScriptProcessor(256, 1, 1);
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();
      const event = { type: 'audioprocess' };

      target.onaudioprocess = callback1;
      target.onaudioprocess = callback2;
      target.addEventListener('audioprocess', callback3);
      target._impl.dispatchEvent(event);

      expect(target.onaudioprocess).toBe(callback2);
      expect(callback1).toHaveBeenCalledTimes(0);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
      expect(callback2.mock.calls[0][0]).toBe(event);
      expect(callback3.mock.calls[0][0]).toBe(event);
    });
  });
});
