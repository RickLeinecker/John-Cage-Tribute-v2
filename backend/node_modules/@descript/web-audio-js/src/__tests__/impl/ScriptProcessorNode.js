'use strict';

import AudioContext from '../../impl/AudioContext';
import ScriptProcessorNode from '../../impl/ScriptProcessorNode';
import AudioNode from '../../impl/AudioNode';
import { EXPLICIT } from '../../constants/ChannelCountMode';

const bufferSize = 256,
  numberOfInputChannels = 1,
  numberOfOutputChannels = 2;

describe('impl/ScriptProcessorNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new ScriptProcessorNode(context, {
      bufferSize,
      numberOfInputChannels,
      numberOfOutputChannels,
    });

    expect(node instanceof ScriptProcessorNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new ScriptProcessorNode(context, {
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels,
      });

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new ScriptProcessorNode(context, {
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels,
      });

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.channelCountMode=', () => {
      const node = new ScriptProcessorNode(context, {
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels,
      });

      expect(node.getChannelCountMode()).toBe('explicit');
      expect(node.inputs[0].getChannelCountMode()).toBe(EXPLICIT);

      node.setChannelCountMode('max');
      expect(node.getChannelCountMode()).toBe('explicit');
      expect(node.inputs[0].getChannelCountMode()).toBe(EXPLICIT);
    });

    it('.channelCount=', () => {
      const node = new ScriptProcessorNode(context, {
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels,
      });

      expect(node.getChannelCount()).toBe(1);

      node.setChannelCount(2);
      expect(node.getChannelCount()).toBe(1);
    });

    it('.bufferSize', () => {
      const node = new ScriptProcessorNode(context, {
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels,
      });

      expect(node.getBufferSize()).toBe(bufferSize);
    });
  });

  describe('channel configuration', () => {
    it('should be kept by the initial configuration', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new ScriptProcessorNode(context, {
        bufferSize,
        numberOfInputChannels,
        numberOfOutputChannels,
      });
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | ScriptProcessorNode
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
      // +--(1)--+
      // | node2 | ScriptProcessorNode
      // +--(2)--+
      //     |
      // +--(2)--+
      // | node3 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(2);
    });
  });
});
