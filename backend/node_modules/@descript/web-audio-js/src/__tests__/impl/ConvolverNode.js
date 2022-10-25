'use strict';

import AudioContext from '../../impl/AudioContext';
import ConvolverNode from '../../impl/ConvolverNode';
import AudioBuffer from '../../impl/AudioBuffer';
import AudioNode from '../../impl/AudioNode';

describe('impl/ConvolverNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new ConvolverNode(context);

    expect(node instanceof ConvolverNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new ConvolverNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new ConvolverNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.channelCount=', () => {
      const node = new ConvolverNode(context);

      expect(node.getChannelCount()).toBe(2);

      node.setChannelCount(1);
      expect(node.getChannelCount()).toBe(1);

      node.setChannelCount(2);
      expect(node.getChannelCount()).toBe(2);

      node.setChannelCount(4);
      expect(node.getChannelCount()).toBe(2);
    });

    it('.channelCountMode=', () => {
      const node = new ConvolverNode(context);

      expect(node.getChannelCountMode()).toBe('clamped-max');

      node.setChannelCountMode('max');
      expect(node.getChannelCountMode()).toBe('clamped-max');

      node.setChannelCountMode('explicit');
      expect(node.getChannelCountMode()).toBe('explicit');

      node.setChannelCountMode('clamped-max');
      expect(node.getChannelCountMode()).toBe('clamped-max');
    });

    it('.buffer=', () => {
      const node = new ConvolverNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 32,
        sampleRate: context.sampleRate,
      });

      expect(node.getBuffer()).toBe(null);

      node.setBuffer(buffer);
      expect(node.getBuffer()).toBe(buffer);
    });

    it('.normalize=', () => {
      const node = new ConvolverNode(context);

      expect(node.getNormalize()).toBe(true);

      node.setNormalize(false);
      expect(node.getNormalize()).toBe(false);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the input, but clamped by 2', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new ConvolverNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | ConvolverNode
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
      // +--(2)--+
      // | node2 | ConvolverNode
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
