'use strict';

import * as np from '../../../__tests_helpers/np';
import AudioContext from '../../../impl/AudioContext';
import AudioDestinationNode from '../../../impl/AudioDestinationNode';
import AudioNode from '../../../impl/AudioNode';

describe('impl/dsp/AudioDestinationNode', () => {
  it('silent', () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];
    const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
    const node1 = new AudioNode(context, {}, { outputs: [2] });
    const node2 = new AudioDestinationNode(context, { numberOfChannels: 2 });
    // const outputBus = node2.output.bus;

    node1.outputs[0].bus.zeros();
    node1.enableOutputsIfNecessary();
    node1.connect(node2);

    node2.process(channelData, 0);

    expect(channelData[0]).toEqual(np.zeros(16));
    expect(channelData[1]).toEqual(np.zeros(16));
  });

  it('noise', () => {
    const channelData = [new Float32Array(16), new Float32Array(16)];
    const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
    const node1 = new AudioNode(context, {}, { outputs: [2] });
    const node2 = new AudioDestinationNode(context, { numberOfChannels: 2 });
    const noise1 = np.random_sample(16);
    const noise2 = np.random_sample(16);

    node1.outputs[0].bus.getMutableData()[0].set(noise1);
    node1.outputs[0].bus.getMutableData()[1].set(noise2);
    node1.enableOutputsIfNecessary();
    node1.connect(node2);

    node2.process(channelData, 0);

    expect(channelData[0]).toEqual(noise1);
    expect(channelData[1]).toEqual(noise2);
  });
});
