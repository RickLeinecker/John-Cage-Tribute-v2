'use strict';

import AudioContext from '../../impl/AudioContext';
import ChannelMergerNode from '../../impl/ChannelMergerNode';
import AudioNode from '../../impl/AudioNode';

describe('impl/ChannelMergerNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new ChannelMergerNode(context, { numberOfInputs: 6 });

    expect(node instanceof ChannelMergerNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new ChannelMergerNode(context, { numberOfInputs: 6 });

      expect(node.getNumberOfInputs()).toBe(6);
    });

    it('.numberOfOutputs', () => {
      const node = new ChannelMergerNode(context, { numberOfInputs: 6 });

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.channelCount=', () => {
      const node = new ChannelMergerNode(context, { numberOfInputs: 6 });

      expect(node.getChannelCount()).toBe(1);

      node.setChannelCount(2);
      expect(node.getChannelCount()).toBe(1);
    });

    it('.channelCountMode=', () => {
      const node = new ChannelMergerNode(context, { numberOfInputs: 2 });

      expect(node.getChannelCountMode()).toBe('explicit');

      node.setChannelCountMode('max');
      expect(node.getChannelCountMode()).toBe('explicit');
    });

    it('.channelInterpretation=', () => {
      const node = new ChannelMergerNode(context, { numberOfInputs: 2 });

      expect(node.getChannelInterpretation()).toBe('speakers');

      node.setChannelInterpretation('discrete');

      expect(node.getChannelInterpretation()).toBe('discrete');
    });
  });

  describe('channel configuration', () => {
    it('should be kept by the initial configuration', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new ChannelMergerNode(context, { numberOfInputs: 6 });
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      //  +-(1)-(1)-(1)-(1)-(1)-(1)-+
      //  |          node2          | ChannelMergerNode
      //  +-----------(6)-----------+
      //               |
      //           +--(6)--+
      //           | node3 |
      //           +-------+
      node2.connect(node3);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[1].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[2].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[3].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[4].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[5].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(6);

      // +-------+
      // | node1 |
      // +--(4)--+
      //     |
      //  +-(1)-(1)-(1)-(1)-(1)-(1)-+
      //  |          node2          | ChannelMergerNode
      //  +-----------(6)-----------+
      //               |
      //           +--(6)--+
      //           | node3 |
      //           +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[1].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[2].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[3].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[4].getNumberOfChannels()).toBe(1);
      expect(node2.inputs[5].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(6);
    });
  });

  describe('enable/disable', () => {
    it('always enabled', () => {
      const node1 = new AudioNode(context, {}, { outputs: [1] });
      const node2 = new AudioNode(context, {}, { outputs: [1] });
      const node3 = new ChannelMergerNode(context, { numberOfInputs: 4 });

      node1.connect(node3, 0, 0);
      node2.connect(node3, 0, 1);

      expect(node3.isEnabled()).toBe(false);

      node1.enableOutputsIfNecessary();
      expect(node3.isEnabled()).toBe(true);

      node2.enableOutputsIfNecessary();
      expect(node3.isEnabled()).toBe(true);

      node1.disableOutputsIfNecessary();
      expect(node3.isEnabled()).toBe(true);

      node2.disableOutputsIfNecessary();
      expect(node3.isEnabled()).toBe(false);
    });
  });
});
