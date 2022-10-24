'use strict';

import AudioContext from '../../impl/AudioContext';
import SpatialListener from '../../impl/SpatialListener';
import AudioParam from '../../impl/AudioParam';

describe('impl/SpatialListener', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new SpatialListener(context);

    expect(node instanceof SpatialListener).toBeTruthy();
  });

  describe('attributes', () => {
    it('.positionX', () => {
      const node = new SpatialListener(context);

      expect(node.getPositionX() instanceof AudioParam).toBeTruthy();
      expect(node.getPositionX().getValue()).toBe(0);
    });

    it('.positionY', () => {
      const node = new SpatialListener(context);

      expect(node.getPositionY() instanceof AudioParam).toBeTruthy();
      expect(node.getPositionY().getValue()).toBe(0);
    });

    it('.positionZ', () => {
      const node = new SpatialListener(context);

      expect(node.getPositionZ() instanceof AudioParam).toBeTruthy();
      expect(node.getPositionZ().getValue()).toBe(0);
    });

    it('.forwardX', () => {
      const node = new SpatialListener(context);

      expect(node.getForwardX() instanceof AudioParam).toBeTruthy();
      expect(node.getForwardX().getValue()).toBe(0);
    });

    it('.forwardY', () => {
      const node = new SpatialListener(context);

      expect(node.getForwardY() instanceof AudioParam).toBeTruthy();
      expect(node.getForwardY().getValue()).toBe(0);
    });

    it('.forwardZ', () => {
      const node = new SpatialListener(context);

      expect(node.getForwardZ() instanceof AudioParam).toBeTruthy();
      expect(node.getForwardZ().getValue()).toBe(0);
    });

    it('.upX', () => {
      const node = new SpatialListener(context);

      expect(node.getUpX() instanceof AudioParam).toBeTruthy();
    });

    it('.upY', () => {
      const node = new SpatialListener(context);

      expect(node.getUpY() instanceof AudioParam).toBeTruthy();
    });

    it('.upZ', () => {
      const node = new SpatialListener(context);

      expect(node.getUpZ() instanceof AudioParam).toBeTruthy();
    });
  });
});
