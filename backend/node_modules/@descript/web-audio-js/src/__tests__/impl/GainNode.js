'use strict';

import AudioContext from '../../impl/AudioContext';
import GainNode from '../../impl/GainNode';
import AudioParam from '../../impl/AudioParam';
import AudioNode from '../../impl/AudioNode';

describe('impl/GainNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new GainNode(context);

    expect(node instanceof GainNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new GainNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new GainNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.gain', () => {
      const node = new GainNode(context);

      expect(node.getGain() instanceof AudioParam).toBeTruthy();
      expect(node.getGain().getValue()).toBe(1);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new GainNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | GainNode
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
      // | node2 | GainNode
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
});
