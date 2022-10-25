'use strict';

import AudioNodeInput from '../../../impl/core/AudioNodeInput';
import AudioBus from '../../../impl/core/AudioBus';
import AudioContext from '../../../impl/AudioContext';
import AudioNode from '../../../impl/AudioNode';
import {
  CLAMPED_MAX,
  EXPLICIT,
  MAX,
} from '../../../constants/ChannelCountMode';

import { DISCRETE, SPEAKERS } from '../../../constants/ChannelInterpretation';

describe('impl/core/AudioNodeInput', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
  });

  it('AudioNode().inputs[0]', () => {
    const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

    expect(node.inputs[0] instanceof AudioNodeInput).toBeTruthy();
  });

  describe('attributes', () => {
    it('.node', () => {
      const node = new AudioNode(context, {}, { inputs: [1, 1] });

      expect(node.inputs[0].node).toBe(node);
      expect(node.inputs[1].node).toBe(node);
    });

    it('.index', () => {
      const node = new AudioNode(context, {}, { inputs: [1, 1] });

      expect(node.inputs[0].index).toBe(0);
      expect(node.inputs[1].index).toBe(1);
    });

    it('.bus', () => {
      const node = new AudioNode(context, {}, { inputs: [1, 1] });

      expect(node.inputs[0].bus instanceof AudioBus).toBeTruthy();
      expect(node.inputs[1].bus instanceof AudioBus).toBeTruthy();
    });

    it('.outputs', () => {
      const node = new AudioNode(context, {}, { inputs: [1, 1] });

      expect(node.inputs[0].outputs).toEqual([]);
      expect(node.inputs[1].outputs).toEqual([]);
    });

    it('.channelCount=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.inputs[0].getChannelCount()).toBe(1);

      node.inputs[0].setChannelCount(2);
      expect(node.inputs[0].getChannelCount()).toBe(2);

      node.inputs[0].setChannelCount(4);
      expect(node.inputs[0].getChannelCount()).toBe(4);

      node.inputs[0].setChannelCount(100);
      expect(node.inputs[0].getChannelCount()).toBe(32);

      node.inputs[0].setChannelCount(0);
      expect(node.inputs[0].getChannelCount()).toBe(1);
    });

    it('.channelCountMode=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.inputs[0].getChannelCountMode()).toBe(MAX);

      node.inputs[0].setChannelCountMode(EXPLICIT);
      expect(node.inputs[0].getChannelCountMode()).toBe(EXPLICIT);

      node.inputs[0].setChannelCountMode(CLAMPED_MAX);
      expect(node.inputs[0].getChannelCountMode()).toBe(CLAMPED_MAX);

      node.inputs[0].setChannelCountMode(MAX);
      expect(node.inputs[0].getChannelCountMode()).toBe(MAX);
    });

    it('.channelInterpretation=', () => {
      const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

      expect(node.inputs[0].getChannelInterpretation()).toBe(SPEAKERS);

      node.inputs[0].setChannelInterpretation(DISCRETE);
      expect(node.inputs[0].getChannelInterpretation()).toBe(DISCRETE);

      node.inputs[0].setChannelInterpretation(SPEAKERS);
      expect(node.inputs[0].getChannelInterpretation()).toBe(SPEAKERS);
    });
  });
});
