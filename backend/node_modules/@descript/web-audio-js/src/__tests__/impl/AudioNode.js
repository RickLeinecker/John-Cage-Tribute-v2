'use strict';

import AudioContext from '../../impl/AudioContext';
import AudioNode from '../../impl/AudioNode';
import EventTarget from '../../impl/EventTarget';
import AudioNodeInput from '../../impl/core/AudioNodeInput';
import AudioNodeOutput from '../../impl/core/AudioNodeOutput';

describe('impl/AudioNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new AudioNode(context);

    expect(node instanceof AudioNode).toBeTruthy();
    expect(node instanceof EventTarget).toBeTruthy();
  });

  describe('attributes', () => {
    it('.context', () => {
      const node = new AudioNode(context);

      expect(node.context).toBe(context);
    });

    it('.blockSize', () => {
      const node = new AudioNode(context);

      expect(node.blockSize).toBe(context.blockSize);
    });

    it('.sampleRate', () => {
      const node = new AudioNode(context);

      expect(node.sampleRate).toBe(context.sampleRate);
    });

    it('.inputs', () => {
      const node = new AudioNode(
        context,
        {},
        { inputs: [1, 1], outputs: [1, 1] },
      );

      expect(node.inputs[0] instanceof AudioNodeInput).toBeTruthy();
      expect(node.inputs[1] instanceof AudioNodeInput).toBeTruthy();
      expect(node.inputs[0]).not.toBe(node.inputs[1]);
    });

    it('.outputs', () => {
      const node = new AudioNode(
        context,
        {},
        { inputs: [1, 1], outputs: [1, 1] },
      );

      expect(node.outputs[0] instanceof AudioNodeOutput).toBeTruthy();
      expect(node.outputs[1] instanceof AudioNodeOutput).toBeTruthy();
      expect(node.outputs[0]).not.toBe(node.outputs[1]);
    });

    it('.numberOfInputs', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.channelCount=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.getChannelCount()).toBe(1);

      node.setChannelCount(2);
      expect(node.getChannelCount()).toBe(2);
    });

    it('.channelCountMode=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.getChannelCountMode()).toBe('max');

      node.setChannelCountMode('clamped-max');
      expect(node.getChannelCountMode()).toBe('clamped-max');

      node.setChannelCountMode('explicit');
      expect(node.getChannelCountMode()).toBe('explicit');

      node.setChannelCountMode('max');
      expect(node.getChannelCountMode()).toBe('max');
    });

    it('.channelInterpretation=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.getChannelInterpretation()).toBe('speakers');

      node.setChannelInterpretation('discrete');
      expect(node.getChannelInterpretation()).toBe('discrete');

      node.setChannelInterpretation('speakers');
      expect(node.getChannelInterpretation()).toBe('speakers');
    });
  });

  describe('methods', () => {
    it('.enableOutputsIfNecessary()', () => {
      const node = new AudioNode(context, {}, { outputs: [1] });
      const output = node.outputs[0];

      output.enable = jest.fn();
      output.disable = jest.fn();

      expect(node.isEnabled()).toBe(false);

      node.enableOutputsIfNecessary();
      expect(node.isEnabled()).toBe(true);
      expect(output.enable).toHaveBeenCalledTimes(1);
      expect(output.disable).toHaveBeenCalledTimes(0);
      output.enable.mockClear();
      output.disable.mockClear();

      node.enableOutputsIfNecessary();
      expect(node.isEnabled()).toBe(true);
      expect(output.enable).toHaveBeenCalledTimes(0);
      expect(output.disable).toHaveBeenCalledTimes(0);
    });

    it('.disableOutputsIfNecessary()', () => {
      const node = new AudioNode(context, {}, { outputs: [1] });
      const output = node.outputs[0];

      node.enableOutputsIfNecessary();
      output.enable = jest.fn();
      output.disable = jest.fn();

      expect(node.isEnabled()).toBe(true);

      node.disableOutputsIfNecessary();
      expect(node.isEnabled()).toBe(false);
      expect(output.enable).toHaveBeenCalledTimes(0);
      expect(output.disable).toHaveBeenCalledTimes(1);
      output.enable.mockClear();
      output.disable.mockClear();

      node.disableOutputsIfNecessary();
      expect(node.isEnabled()).toBe(false);
      expect(output.enable).toHaveBeenCalledTimes(0);
      expect(output.disable).toHaveBeenCalledTimes(0);
      output.enable.mockClear();
      output.disable.mockClear();
    });
  });
});
