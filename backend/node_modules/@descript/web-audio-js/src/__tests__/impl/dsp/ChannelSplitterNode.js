'use strict';

import * as np from '../../../__tests_helpers/np';
import AudioContext from '../../../impl/AudioContext';
import ChannelSplitterNode from '../../../impl/ChannelSplitterNode';
import AudioNode from '../../../impl/AudioNode';

const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
const channelData = [new Float32Array(16), new Float32Array(16)];

describe('impl/dsp/ChannelSplitterNode', () => {
  it('works', () => {
    const node1 = new AudioNode(context, {}, { outputs: [4] });
    const node2 = new ChannelSplitterNode(context, { numberOfOutputs: 6 });
    const noise1 = np.random_sample(16);
    const noise2 = np.random_sample(16);

    context.resume();
    node1.connect(node2);
    node2.connect(context.getDestination());
    node1.enableOutputsIfNecessary();
    [0, 1, 2, 3, 4, 5].forEach((ch) => {
      node2.outputs[ch].bus.getMutableData()[0].set(np.random_sample(16));
    });
    node1.outputs[0].bus.getMutableData()[0].set(noise1);
    node1.outputs[0].bus.getMutableData()[1].set(noise2);
    node1.outputs[0].bus.getMutableData()[2].set(noise1);
    node1.outputs[0].bus.getMutableData()[3].set(noise2);

    context.process(channelData, 0);

    const actual = [0, 1, 2, 3, 4, 5].map(
      (ch) => node2.outputs[ch].bus.getChannelData()[0],
    );
    const isSilent = [0, 1, 2, 3, 4, 5].map(
      (ch) => node2.outputs[ch].bus.isSilent,
    );

    expect(isSilent[0]).toBe(false);
    expect(isSilent[1]).toBe(false);
    expect(isSilent[2]).toBe(false);
    expect(isSilent[3]).toBe(false);
    expect(isSilent[4]).toBe(true);
    expect(isSilent[5]).toBe(true);
    expect(actual[0]).toEqual(noise1);
    expect(actual[1]).toEqual(noise2);
    expect(actual[2]).toEqual(noise1);
    expect(actual[3]).toEqual(noise2);
    expect(actual[4]).toEqual(np.zeros(16));
    expect(actual[5]).toEqual(np.zeros(16));
  });

  it('works - silent', () => {
    const node1 = new AudioNode(context, {}, { outputs: [4] });
    const node2 = new ChannelSplitterNode(context, { numberOfOutputs: 6 });

    context.resume();
    node1.connect(node2);
    node2.connect(context.getDestination());
    node1.enableOutputsIfNecessary();
    [0, 1, 2, 3, 4, 5].forEach((ch) => {
      node2.outputs[ch].bus.getMutableData()[0].set(np.random_sample(16));
    });

    context.process(channelData, 0);

    const actual = [0, 1, 2, 3, 4, 5].map(
      (ch) => node2.outputs[ch].bus.getChannelData()[0],
    );
    const isSilent = [0, 1, 2, 3, 4, 5].map(
      (ch) => node2.outputs[ch].bus.isSilent,
    );

    expect(isSilent[0]).toBe(true);
    expect(isSilent[1]).toBe(true);
    expect(isSilent[2]).toBe(true);
    expect(isSilent[3]).toBe(true);
    expect(isSilent[4]).toBe(true);
    expect(isSilent[5]).toBe(true);
    expect(actual[0]).toEqual(np.zeros(16));
    expect(actual[1]).toEqual(np.zeros(16));
    expect(actual[2]).toEqual(np.zeros(16));
    expect(actual[3]).toEqual(np.zeros(16));
    expect(actual[4]).toEqual(np.zeros(16));
    expect(actual[5]).toEqual(np.zeros(16));
  });
});
