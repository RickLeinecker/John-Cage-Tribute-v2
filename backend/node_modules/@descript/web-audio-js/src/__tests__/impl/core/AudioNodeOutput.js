'use strict';

import AudioNodeOutput from '../../../impl/core/AudioNodeOutput';
import AudioBus from '../../../impl/core/AudioBus';
import AudioContext from '../../../impl/AudioContext';
import AudioNode from '../../../impl/AudioNode';

describe('impl/core/AudioNodeOutput', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
  });

  it('AudioNode().outputs[0]', () => {
    const node = new AudioNode(context, {}, { outputs: [1] });

    expect(node.outputs[0] instanceof AudioNodeOutput).toBeTruthy();
  });

  describe('atrributes', () => {
    it('.node', () => {
      const node = new AudioNode(context, {}, { outputs: [1, 1] });

      expect(node.outputs[0].node).toBe(node);
      expect(node.outputs[1].node).toBe(node);
    });

    it('.index', () => {
      const node = new AudioNode(context, {}, { outputs: [1, 1] });

      expect(node.outputs[0].index).toBe(0);
      expect(node.outputs[1].index).toBe(1);
    });

    it('.bus', () => {
      const node = new AudioNode(context, {}, { outputs: [1, 1] });

      expect(node.outputs[0].bus instanceof AudioBus).toBeTruthy();
      expect(node.outputs[1].bus instanceof AudioBus).toBeTruthy();
    });

    it('.inputs', () => {
      const node = new AudioNode(context, {}, { outputs: [1, 1] });

      expect(node.outputs[0].inputs).toEqual([]);
      expect(node.outputs[1].inputs).toEqual([]);
    });

    it('.numberOfChannels=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1, 1] });

      expect(node.outputs[0].getNumberOfChannels()).toBe(1);
      expect(node.outputs[1].getNumberOfChannels()).toBe(1);

      node.outputs[0].setNumberOfChannels(2);
      expect(node.outputs[0].getNumberOfChannels()).toBe(2);
      expect(node.outputs[1].getNumberOfChannels()).toBe(1);
    });
  });

  describe('methods', () => {
    it('.zeros()', () => {
      const node = new AudioNode(
        context,
        {},
        { inputs: [1, 1], outputs: [1, 1] },
      );

      node.outputs[0].bus.getMutableData();
      node.outputs[1].bus.getMutableData();
      expect(node.outputs[0].bus.isSilent).toBe(false);
      expect(node.outputs[1].bus.isSilent).toBe(false);

      node.outputs[0].zeros();
      expect(node.outputs[0].bus.isSilent).toBe(true);
      expect(node.outputs[1].bus.isSilent).toBe(false);
    });

    it('.pull()', () => {
      const node = new AudioNode(
        context,
        {},
        { inputs: [1, 1], outputs: [1, 1] },
      );

      node.dspProcess = jest.fn();

      const retVal = node.outputs[0].pull();

      expect(node.dspProcess).toHaveBeenCalledTimes(1);
      expect(retVal instanceof AudioBus).toBeTruthy();
    });
  });
});
