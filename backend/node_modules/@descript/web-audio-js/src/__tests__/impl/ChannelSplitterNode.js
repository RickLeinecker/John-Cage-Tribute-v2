'use strict';

import AudioContext from '../../impl/AudioContext';
import ChannelSplitterNode from '../../impl/ChannelSplitterNode';
import AudioNode from '../../impl/AudioNode';

describe('impl/ChannelSplitterNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new ChannelSplitterNode(context, { numberOfOutputs: 6 });

    expect(node instanceof ChannelSplitterNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new ChannelSplitterNode(context, { numberOfOutputs: 6 });

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new ChannelSplitterNode(context, { numberOfOutputs: 6 });

      expect(node.getNumberOfOutputs()).toBe(6);
    });
  });

  describe('channel configuration', () => {
    it('should be kept by the initial configuration', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new ChannelSplitterNode(context, { numberOfOutputs: 6 });
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      //           +-------+
      //           | node1 |
      //           +--(4)--+
      //
      //  +-----------(1)-----------+
      //  |          node2          | ChannelMergerNode
      //  +-(1)-(1)-(1)-(1)-(1)-(1)-+
      //     |
      // +--(1)--+
      // | node3 |
      // +-------+
      node2.connect(node3);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(1);

      //           +-------+
      //           | node1 |
      //           +--(4)--+
      //               |
      //  +-----------(4)-----------+
      //  |          node2          | ChannelMergerNode
      //  +-(1)-(1)-(1)-(1)-(1)-(1)-+
      //     |
      // +--(1)--+
      // | node3 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(4);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(1);
    });
  });
});
