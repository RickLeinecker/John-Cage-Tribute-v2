'use strict';

import AudioContext from '../../../impl/AudioContext';
import AudioNode from '../../../impl/AudioNode';

describe('impl/core/AudioNode - Connection', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
  });

  it('connect()', () => {
    const node1 = new AudioNode(context, {}, { outputs: [1] });
    const node2 = new AudioNode(context, {}, { inputs: [1] });

    // +-------+
    // | node1 |
    // +-------+
    //     |
    // +-------+
    // | node2 |
    // +-------+
    node1.outputs[0].enable();
    node1.connect(node2);

    expect(node1.outputs[0].isConnectedTo(node2)).toBe(true);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(true);
  });

  it('disconnect()', () => {
    const node1 = new AudioNode(context, {}, { outputs: [1] });
    const node2 = new AudioNode(context, {}, { inputs: [1] });
    const node3 = new AudioNode(context, {}, { inputs: [1] });

    //       +-------+
    //       | node1 |
    //       +-------+
    //           |
    //     +-----+-----+
    //     |           |
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.outputs[0].enable();
    node1.connect(node2);
    node1.connect(node3);

    //       +-------+
    //       | node1 |
    //       +-------+
    //
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.disconnect();
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(false);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(false);
  });

  it('disconnect(output)', () => {
    const node1 = new AudioNode(context, {}, { outputs: [1, 1] });
    const node2 = new AudioNode(context, {}, { inputs: [1] });
    const node3 = new AudioNode(context, {}, { inputs: [1] });

    //       +-------+
    //       | node1 |
    //       +-------+
    //         |   |
    //     +---+   +---+
    //     |           |
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.outputs[0].enable();
    node1.outputs[1].enable();
    node1.connect(node2, 0);
    node1.connect(node3, 1);

    //       +-------+
    //       | node1 |
    //       +-------+
    //         |
    //     +---+
    //     |
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.disconnect(1);
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(true);
    expect(node1.outputs[0].isConnectedTo(node3)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node3)).toBe(false);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(true);
    expect(node3.inputs[0].isConnectedFrom(node1)).toBe(false);

    //       +-------+
    //       | node1 |
    //       +-------+
    //
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.disconnect(0);
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[0].isConnectedTo(node3)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node3)).toBe(false);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(false);
    expect(node3.inputs[0].isConnectedFrom(node1)).toBe(false);
  });

  it('disconnect(destination)', () => {
    const node1 = new AudioNode(context, {}, { outputs: [1] });
    const node2 = new AudioNode(context, {}, { inputs: [1] });
    const node3 = new AudioNode(context, {}, { inputs: [1] });

    //       +-------+
    //       | node1 |
    //       +-------+
    //           |
    //     +-----+-----+
    //     |           |
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.outputs[0].enable();
    node1.connect(node2);
    node1.connect(node3);

    //       +-------+
    //       | node1 |
    //       +-------+
    //           |
    //     +-----+
    //     |
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.disconnect(node3);
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(true);
    expect(node1.outputs[0].isConnectedTo(node3)).toBe(false);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(true);
    expect(node3.inputs[0].isConnectedFrom(node1)).toBe(false);

    //       +-------+
    //       | node1 |
    //       +-------+
    //
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    node1.disconnect(node2);
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[0].isConnectedTo(node3)).toBe(false);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(false);
    expect(node3.inputs[0].isConnectedFrom(node1)).toBe(false);
  });

  it('disconnect(destination, output)', () => {
    //       +-------+
    //       | node1 |
    //       +-------+
    //         |   |
    //     +---+   +---+
    //     |           |
    // +-------+   +-------+
    // | node2 |   | node3 |
    // +-------+   +-------+
    const node1 = new AudioNode(context, {}, { outputs: [1, 1] });
    const node2 = new AudioNode(context, {}, { inputs: [1] });
    const node3 = new AudioNode(context, {}, { inputs: [1] });

    node1.outputs[0].enable();
    node1.outputs[1].enable();
    node1.connect(node2, 0);
    node1.connect(node3, 1);

    node1.disconnect(node2, 1);
    node1.disconnect(node3, 0);
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(true);
    expect(node1.outputs[0].isConnectedTo(node3)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node3)).toBe(true);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(true);
    expect(node3.inputs[0].isConnectedFrom(node1)).toBe(true);

    node1.disconnect(node2, 0);
    node1.disconnect(node3, 1);
    expect(node1.outputs[0].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[0].isConnectedTo(node3)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node2)).toBe(false);
    expect(node1.outputs[1].isConnectedTo(node3)).toBe(false);
    expect(node2.inputs[0].isConnectedFrom(node1)).toBe(false);
    expect(node3.inputs[0].isConnectedFrom(node1)).toBe(false);
  });

  it('enabled/disabled propagation', () => {
    const node1 = new AudioNode(context, {}, { outputs: [1] });
    const node2 = new AudioNode(context, {}, { inputs: [1], outputs: [1] });
    const node3 = new AudioNode(context, {}, { outputs: [1] });
    const node4 = new AudioNode(context, {}, { inputs: [1] });

    // +-------+
    // | node1 |
    // +---x---+
    //     |
    // +---x---+   +-------+
    // | node2 |   | node3 |
    // +---x---+   +---x---+
    //     |           |
    //     +-----+-----+
    //           |
    //       +---x---+
    //       | node4 |
    //       +-------+
    node1.connect(node2);
    node2.connect(node4);
    node3.connect(node4);
    expect(node1.outputs[0].isEnabled()).toBe(false);
    expect(node2.inputs[0].isEnabled()).toBe(false);
    expect(node2.outputs[0].isEnabled()).toBe(false);
    expect(node3.outputs[0].isEnabled()).toBe(false);
    expect(node4.inputs[0].isEnabled()).toBe(false);

    // +-------+
    // | node1 |
    // +---o---+
    //     |
    // +---o---+   +-------+
    // | node2 |   | node3 |
    // +---o---+   +---x---+
    //     |           |
    //     +-----+-----+
    //           |
    //       +---o---+
    //       | node4 |
    //       +-------+
    node1.outputs[0].enable();
    expect(node1.outputs[0].isEnabled()).toBe(true);
    expect(node2.inputs[0].isEnabled()).toBe(true);
    expect(node2.outputs[0].isEnabled()).toBe(true);
    expect(node3.outputs[0].isEnabled()).toBe(false);
    expect(node4.inputs[0].isEnabled()).toBe(true);

    // +-------+
    // | node1 |
    // +---o---+
    //     |
    // +---o---+   +-------+
    // | node2 |   | node3 |
    // +---o---+   +---o---+
    //     |           |
    //     +-----+-----+
    //           |
    //       +---o---+
    //       | node4 |
    //       +-------+
    node3.outputs[0].enable();
    expect(node1.outputs[0].isEnabled()).toBe(true);
    expect(node2.inputs[0].isEnabled()).toBe(true);
    expect(node2.outputs[0].isEnabled()).toBe(true);
    expect(node3.outputs[0].isEnabled()).toBe(true);
    expect(node4.inputs[0].isEnabled()).toBe(true);

    // +-------+
    // | node1 |
    // +---o---+
    //
    // +---x---+   +-------+
    // | node2 |   | node3 |
    // +---x---+   +---o---+
    //     |           |
    //     +-----+-----+
    //           |
    //       +---o---+
    //       | node4 |
    //       +-------+
    node1.disconnect();
    expect(node1.outputs[0].isEnabled()).toBe(true);
    expect(node2.inputs[0].isEnabled()).toBe(false);
    expect(node2.outputs[0].isEnabled()).toBe(false);
    expect(node3.outputs[0].isEnabled()).toBe(true);
    expect(node4.inputs[0].isEnabled()).toBe(true);

    // +-------+
    // | node1 |
    // +---o---+
    //
    // +---x---+   +-------+
    // | node2 |   | node3 |
    // +---x---+   +---x---+
    //     |           |
    //     +-----+-----+
    //           |
    //       +---x---+
    //       | node4 |
    //       +-------+
    node3.outputs[0].disable();
    expect(node1.outputs[0].isEnabled()).toBe(true);
    expect(node2.inputs[0].isEnabled()).toBe(false);
    expect(node2.outputs[0].isEnabled()).toBe(false);
    expect(node3.outputs[0].isEnabled()).toBe(false);
    expect(node4.inputs[0].isEnabled()).toBe(false);
  });

  it('misc', () => {
    const node = new AudioNode(context, {}, { inputs: [1], outputs: [1] });

    expect(node.inputs[0].isConnectedFrom()).toBe(false);
    expect(node.outputs[0].isConnectedTo()).toBe(false);
  });
});
