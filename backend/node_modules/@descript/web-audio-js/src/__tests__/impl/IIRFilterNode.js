'use strict';

import AudioContext from '../../impl/AudioContext';
import IIRFilterNode from '../../impl/IIRFilterNode';
import AudioNode from '../../impl/AudioNode';

const feedforward = new Float32Array(8);
const feedback = new Float32Array(8);

describe('impl/IIRFilterNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new IIRFilterNode(context, { feedforward, feedback });

    expect(node instanceof IIRFilterNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new IIRFilterNode(context, { feedforward, feedback });

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new IIRFilterNode(context, { feedforward, feedback });

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.feedforward', () => {
      const node = new IIRFilterNode(context, { feedforward, feedback });

      expect(node.getFeedforward()).toBe(feedforward);
    });

    it('.feedback', () => {
      const node = new IIRFilterNode(context, { feedforward, feedback });

      expect(node.getFeedback()).toBe(feedback);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new IIRFilterNode(context, { feedforward, feedback });
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | IIRFilterNode
      // +--(1)--+
      //     |
      // +--(1)--+
      // | node3 |
      // +-------+
      node2.connect(node3);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(1);

      // +-------+
      // | node1 |
      // +--(4)--+
      //     |
      // +--(4)--+
      // | node2 | IIRFilterNode
      // +--(4)--+
      //     |
      // +--(4)--+
      // | node3 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(4);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(4);
    });
  });

  describe('response data', () => {
    it.skip('works', () => {});
  });
});
