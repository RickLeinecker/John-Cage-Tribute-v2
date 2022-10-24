'use strict';

import AudioContext from '../../impl/AudioContext';
import ConstantSourceNode from '../../impl/ConstantSourceNode';
import AudioParam from '../../impl/AudioParam';
import AudioNode from '../../impl/AudioNode';

describe('impl/ConstantSourceNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new ConstantSourceNode(context);

    expect(node instanceof ConstantSourceNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new ConstantSourceNode(context);

      expect(node.getNumberOfInputs()).toBe(0);
    });

    it('.numberOfOutputs', () => {
      const node = new ConstantSourceNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.offset', () => {
      const node = new ConstantSourceNode(context);

      expect(node.getOffset() instanceof AudioParam).toBeTruthy();
      expect(node.getOffset().getValue()).toBe(1);
    });
  });
});
