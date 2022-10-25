'use strict';

import AudioContext from '../../impl/AudioContext';
import AudioDestinationNode from '../../impl/AudioDestinationNode';
import AudioNode from '../../impl/AudioNode';

describe('impl/AudioDestinationNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new AudioDestinationNode(context, { numberOfChannels: 2 });

    expect(node instanceof AudioDestinationNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new AudioDestinationNode(context, { numberOfChannels: 2 });

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new AudioDestinationNode(context, { numberOfChannels: 2 });

      expect(node.getNumberOfOutputs()).toBe(0);
    });

    it('.maxChannelCount', () => {
      const node = new AudioDestinationNode(context, { numberOfChannels: 2 });

      expect(node.getMaxChannelCount()).toBe(2);
    });

    it('.channelCount=', () => {
      const node = new AudioDestinationNode(context, { numberOfChannels: 2 });

      node.setChannelCount(0);
      expect(node.getChannelCount()).toBe(1);

      node.setChannelCount(1);
      expect(node.getChannelCount()).toBe(1);

      node.setChannelCount(2);
      expect(node.getChannelCount()).toBe(2);

      node.setChannelCount(4);
      expect(node.getChannelCount()).toBe(2);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input, but clamped by max channel count', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new AudioDestinationNode(context, { numberOfChannels: 2 });

      node1.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(2)--+
      // | node2 | AudioDestinationNode
      // +-------+
      expect(node2.inputs[0].getNumberOfChannels()).toBe(2);

      // +-------+
      // | node1 |
      // +--(4)--+
      //     |
      // +--(2)--+
      // | node2 | AudioDestinationNode
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(2);
    });
  });
});
