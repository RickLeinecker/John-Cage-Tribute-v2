'use strict';

import AudioContext from '../../../impl/AudioContext';

const contextOpts = { sampleRate: 8000, blockSize: 16 };

describe('impl/dsp/AudioContext', () => {
  let context, destination;

  beforeAll(() => {
    context = new AudioContext(contextOpts);
    destination = context.getDestination();

    context.resume();
  });

  it('1: time advances', () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];

    expect(context.getCurrentTime()).toBe(0);
    destination.process = jest.fn();

    context.process(channelData, 0);

    expect(destination.process).toHaveBeenCalledTimes(1);
    expect(destination.process).toBeCalledWith(channelData, 0);
    expect(context.getCurrentTime()).toBe(16 / 8000);
  });

  it('2: do post process and reserve pre process (for next process)', () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];
    const callOrder = [];
    const immediateSpy = jest.fn(() => callOrder.push('immediateSpy'));

    expect(context.getCurrentTime()).toBe(16 / 8000);
    destination.process = jest.fn(() => {
      callOrder.push('destination.process');
      context.addPostProcess(immediateSpy);
    });

    context.process(channelData, 0);

    expect(destination.process).toHaveBeenCalledTimes(1);
    expect(destination.process).toBeCalledWith(channelData, 0);
    expect(context.getCurrentTime()).toBe(32 / 8000);
    expect(immediateSpy).toHaveBeenCalledTimes(1);
    expect(callOrder).toEqual(['destination.process', 'immediateSpy']);
  });
});
