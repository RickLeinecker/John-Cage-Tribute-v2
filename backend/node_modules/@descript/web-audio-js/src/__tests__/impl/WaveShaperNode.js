'use strict';

import AudioContext from '../../impl/AudioContext';
import WaveShaperNode from '../../impl/WaveShaperNode';
import AudioNode from '../../impl/AudioNode';

describe('impl/WaveShaperNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new WaveShaperNode(context);

    expect(node instanceof WaveShaperNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new WaveShaperNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new WaveShaperNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.curve=', () => {
      const node = new WaveShaperNode(context);
      const curve = new Float32Array(128);

      expect(node.getCurve()).toBe(null);

      node.setCurve(curve);
      expect(node.getCurve()).toBe(curve);
    });

    it('.oversample=', () => {
      const node = new WaveShaperNode(context);

      expect(node.getOversample()).toBe('none');

      ['none', '2x', '4x'].forEach((oversample) => {
        node.setOversample(oversample);
        expect(node.getOversample()).toBe(oversample);
      });
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new WaveShaperNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | WaveShaperNode
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
      // | node2 | WaveShaperNode
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
