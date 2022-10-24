'use strict';

import AudioContext from '../../impl/AudioContext';
import StereoPannerNode from '../../impl/StereoPannerNode';
import BasePannerNode from '../../impl/BasePannerNode';
import AudioParam from '../../impl/AudioParam';

describe('impl/StereoPannerNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new StereoPannerNode(context);

    expect(node instanceof StereoPannerNode).toBeTruthy();
    expect(node instanceof BasePannerNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new StereoPannerNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new StereoPannerNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.pan', () => {
      const node = new StereoPannerNode(context);

      expect(node.getPan() instanceof AudioParam).toBeTruthy();
      expect(node.getPan().getValue()).toBe(0);
    });
  });
});
