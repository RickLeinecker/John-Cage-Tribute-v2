'use strict';

import AudioContext from '../../impl/AudioContext';
import AudioDestinationNode from '../../impl/AudioDestinationNode';
import AudioListener from '../../impl/AudioListener';

const contextOpts = { sampleRate: 8000, blockSize: 16 };

describe('impl/AudioContext', () => {
  it('constructor', () => {
    const context = new AudioContext(contextOpts);

    expect(context instanceof AudioContext).toBeTruthy();
  });

  describe('attributes', () => {
    it('.destination', () => {
      const context = new AudioContext(contextOpts);

      expect(
        context.getDestination() instanceof AudioDestinationNode,
      ).toBeTruthy();
    });

    it('.sampleRate', () => {
      const context = new AudioContext(contextOpts);

      expect(context.getSampleRate()).toBe(contextOpts.sampleRate);
    });

    it('.currentTime', () => {
      const context = new AudioContext(contextOpts);

      expect(context.getCurrentTime()).toBe(0);
    });

    it('.listener', () => {
      const context = new AudioContext(contextOpts);

      expect(context.getListener() instanceof AudioListener).toBeTruthy();
    });
  });

  describe('methods', () => {
    it('.reset()', () => {
      const context = new AudioContext(contextOpts);
      const channelData = [new Float32Array(16), new Float32Array(16)];

      context.resume();
      context.process(channelData, 0);

      expect(context.getState()).toBe('running');
      expect(context.currentTime).not.toBe(0);

      context.reset();
      expect(context.getState()).toBe('suspended');
      expect(context.currentTime).toBe(0);
    });
  });

  describe('state change', () => {
    let context, stateChangeSpy;

    beforeAll(() => {
      context = new AudioContext(contextOpts);
      stateChangeSpy = jest.fn();

      context.addEventListener('statechange', stateChangeSpy);
    });

    beforeEach(() => {
      stateChangeSpy.mockReset();
    });

    it('resume', () => {
      expect(context.getState()).toBe('suspended');

      context.resume();
      expect(context.getState()).toBe('running');
      expect(stateChangeSpy.mock.calls).toHaveLength(1);

      // resume() in state 'running'
      context.resume();
      expect(context.getState()).toBe('running');
      expect(stateChangeSpy.mock.calls).toHaveLength(1);
    });

    it('suspend', () => {
      expect(context.getState()).toBe('running');

      context.suspend();
      expect(context.getState()).toBe('suspended');
      expect(stateChangeSpy.mock.calls).toHaveLength(1);

      // suspend() in state 'suspended'
      context.suspend();
      expect(context.getState()).toBe('suspended');
      expect(stateChangeSpy.mock.calls).toHaveLength(1);
    });

    it('close', () => {
      expect(context.getState()).toBe('suspended');

      context.close();
      expect(context.getState()).toBe('closed');
      expect(stateChangeSpy.mock.calls).toHaveLength(1);

      // close() in state 'closed'
      context.close();
      expect(context.getState()).toBe('closed');
      expect(stateChangeSpy.mock.calls).toHaveLength(1);
    });
  });
});
