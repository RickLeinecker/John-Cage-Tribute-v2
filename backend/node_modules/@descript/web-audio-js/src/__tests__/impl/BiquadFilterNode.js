'use strict';

import AudioContext from '../../impl/AudioContext';
import BiquadFilterNode from '../../impl/BiquadFilterNode';
import AudioParam from '../../impl/AudioParam';
import AudioNode from '../../impl/AudioNode';

describe('impl/BiquadFilterNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new BiquadFilterNode(context);

    expect(node instanceof BiquadFilterNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.type=', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getType()).toBe('lowpass');

      [
        'lowpass',
        'highpass',
        'bandpass',
        'lowshelf',
        'highshelf',
        'peaking',
        'notch',
        'allpass',
      ].forEach((type) => {
        node.setType(type);
        expect(node.getType()).toBe(type);
      });
    });

    it('.frequency', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getFrequency() instanceof AudioParam).toBeTruthy();
      expect(node.getFrequency().getValue()).toBe(350);
    });

    it('.detune', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getDetune() instanceof AudioParam).toBeTruthy();
      expect(node.getDetune().getValue()).toBe(0);
    });

    it('.Q', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getQ() instanceof AudioParam).toBeTruthy();
      expect(node.getQ().getValue()).toBe(1);
    });

    it('.gain', () => {
      const node = new BiquadFilterNode(context);

      expect(node.getGain() instanceof AudioParam).toBeTruthy();
      expect(node.getGain().getValue()).toBe(0);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new BiquadFilterNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | BiquadFilterNode
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
      // | node2 | BiquadFilterNode
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
    it.skip('work', () => {});
  });
});
