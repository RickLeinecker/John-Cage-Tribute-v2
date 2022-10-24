'use strict';

import AudioContext from '../../../impl/AudioContext';
import AudioNode from '../../../impl/AudioNode';
import GainNode from '../../../impl/GainNode';

describe('impl/core/AudioNode - ChannelPropagation', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
  });

  it('numberOfChannels', () => {
    const node1 = new GainNode(context);
    const node2 = new GainNode(context);
    const node3 = new GainNode(context);

    // +-------+
    // | node1 |
    // +-------+
    //     |
    // +-------+
    // | node2 |
    // +-------+
    //     |
    // +-------+
    // | node3 |
    // +-------+
    node1.outputs[0].enable();
    node2.outputs[0].enable();
    node1.connect(node2);
    node2.connect(node3);

    expect(node1.outputs[0].getNumberOfChannels()).toBe(1);
    expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
    expect(node2.outputs[0].getNumberOfChannels()).toBe(1);
    expect(node3.inputs[0].getNumberOfChannels()).toBe(1);

    node1.outputs[0].setNumberOfChannels(4);
    expect(node1.outputs[0].getNumberOfChannels()).toBe(4);
    expect(node2.inputs[0].getNumberOfChannels()).toBe(4);
    expect(node2.outputs[0].getNumberOfChannels()).toBe(4);
    expect(node3.inputs[0].getNumberOfChannels()).toBe(4);
  });

  it('computedNumberOfChannels', () => {
    const node1 = new AudioNode(context, {}, { inputs: [1], outputs: [1] });
    const node2 = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

    node1.connect(node2);
    node1.outputs[0].enable();

    node1.outputs[0].setNumberOfChannels(1);

    node2.setChannelCount(4);
    [
      ['max', 1],
      ['clamped-max', 1],
      ['explicit', 4],
    ].forEach(([countMode, expected]) => {
      node2.setChannelCountMode(countMode);
      expect(node2.inputs[0].computeNumberOfChannels()).toBe(expected);
    });

    node1.outputs[0].setNumberOfChannels(8);
    [
      ['max', 8],
      ['clamped-max', 4],
      ['explicit', 4],
    ].forEach(([countMode, expected]) => {
      node2.setChannelCountMode(countMode);
      expect(node2.inputs[0].computeNumberOfChannels()).toBe(expected);
    });
  });
});
