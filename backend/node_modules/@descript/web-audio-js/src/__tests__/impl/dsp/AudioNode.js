'use strict';

import AudioContext from '../../../impl/AudioContext';
import GainNode from '../../../impl/GainNode';

const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });

describe('impl/dsp/AudioNode', () => {
  it('propagation', () => {
    const node1 = new GainNode(context);
    const node2 = new GainNode(context);
    const node3 = new GainNode(context);
    const param = node1.getGain();

    node1.outputs[0].enable();
    node2.outputs[0].enable();
    node1.connect(node2);
    node2.connect(node3);

    node1.dspProcess = jest.fn();
    param.dspProcess = jest.fn();

    node3.processIfNecessary();

    expect(param.dspProcess).toHaveBeenCalledTimes(1);
  });

  it('feedback loop', () => {
    const node1 = new GainNode(context);
    const node2 = new GainNode(context);
    const node3 = new GainNode(context);

    node1.outputs[0].enable();
    node2.outputs[0].enable();
    node1.connect(node2);
    node2.connect(node3);
    node3.connect(node1);

    node1.dspProcess = jest.fn();

    node3.processIfNecessary();

    expect(node1.dspProcess).toHaveBeenCalledTimes(1);
  });
});
