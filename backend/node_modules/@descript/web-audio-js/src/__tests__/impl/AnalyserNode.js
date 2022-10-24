'use strict';

import AudioContext from '../../impl/AudioContext';
import AnalyserNode from '../../impl/AnalyserNode';
import AudioNode from '../../impl/AudioNode';

describe('impl/AnalyserNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new AnalyserNode(context);

    expect(node instanceof AudioNode).toBeTruthy();
    expect(node instanceof AnalyserNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new AnalyserNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new AnalyserNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.fftSize=', () => {
      const node = new AnalyserNode(context);

      expect(node.getFftSize()).toBe(2048);

      node.setFftSize(512);
      expect(node.getFftSize()).toBe(512);
    });

    it('.frequencyBinCount', () => {
      const node = new AnalyserNode(context);

      expect(node.getFrequencyBinCount()).toBe(1024);

      node.setFftSize(512);
      expect(node.getFrequencyBinCount()).toBe(256);
    });

    it('.minDecibels=', () => {
      const node = new AnalyserNode(context);

      expect(node.getMinDecibels()).toBe(-100);

      node.setMinDecibels(-120);
      expect(node.getMinDecibels()).toBe(-120);
    });

    it('.maxDecibels=', () => {
      const node = new AnalyserNode(context);

      expect(node.getMaxDecibels()).toBe(-30);

      node.setMaxDecibels(-20);
      expect(node.getMaxDecibels()).toBe(-20);
    });

    it('.smoothingTimeConstant=', () => {
      const node = new AnalyserNode(context);

      expect(node.getSmoothingTimeConstant()).toBe(0.8);

      node.setSmoothingTimeConstant(0.6);
      expect(node.getSmoothingTimeConstant()).toBe(0.6);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new AnalyserNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | AnalyserNode
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
      // | node2 | AnalyserNode
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
