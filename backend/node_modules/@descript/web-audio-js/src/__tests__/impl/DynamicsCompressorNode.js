'use strict';

import AudioContext from '../../impl/AudioContext';
import DynamicsCompressorNode from '../../impl/DynamicsCompressorNode';
import AudioParam from '../../impl/AudioParam';
import AudioNode from '../../impl/AudioNode';

describe('impl/DynamicsCompressorNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new DynamicsCompressorNode(context);

    expect(node instanceof DynamicsCompressorNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.threshold', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getThreshold() instanceof AudioParam).toBeTruthy();
      expect(node.getThreshold().getValue()).toBe(-24);
    });

    it('.knee', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getKnee() instanceof AudioParam).toBeTruthy();
      expect(node.getKnee().getValue()).toBe(30);
    });

    it('.ratio', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getRatio() instanceof AudioParam).toBeTruthy();
      expect(node.getRatio().getValue()).toBe(12);
    });

    it('.attack', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getAttack() instanceof AudioParam).toBeTruthy();
      expect(node.getAttack().getValue()).toBe(0.003);
    });

    it('.release', () => {
      const node = new DynamicsCompressorNode(context);

      expect(node.getRelease() instanceof AudioParam).toBeTruthy();
      expect(node.getRelease().getValue()).toBe(0.25);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input, but clamped by 2', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new DynamicsCompressorNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | DynamicsCompressorNode
      // +--(2)--+
      //     |
      // +--(2)--+
      // | node3 |
      // +-------+
      node2.connect(node3);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(2);

      // +-------+
      // | node1 |
      // +--(4)--+
      //     |
      // +--(2)--+
      // | node2 | DynamicsCompressorNode
      // +--(2)--+
      //     |
      // +--(2)--+
      // | node3 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(2);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(2);
    });
  });
});
