'use strict';

import AudioContext from '../../impl/AudioContext';
import SpatialPannerNode from '../../impl/SpatialPannerNode';
import BasePannerNode from '../../impl/BasePannerNode';
import AudioParam from '../../impl/AudioParam';

describe('impl/SpatialPannerNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new SpatialPannerNode(context);

    expect(node instanceof SpatialPannerNode).toBeTruthy();
    expect(node instanceof BasePannerNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.positionX', () => {
      const node = new SpatialPannerNode(context);

      expect(node.getPositionX() instanceof AudioParam).toBeTruthy();
      expect(node.getPositionX().getValue()).toBe(0);
    });

    it('.positionY', () => {
      const node = new SpatialPannerNode(context);

      expect(node.getPositionY() instanceof AudioParam).toBeTruthy();
      expect(node.getPositionY().getValue()).toBe(0);
    });

    it('.positionZ', () => {
      const node = new SpatialPannerNode(context);

      expect(node.getPositionZ() instanceof AudioParam).toBeTruthy();
      expect(node.getPositionZ().getValue()).toBe(0);
    });

    it('.orientationX', () => {
      const node = new SpatialPannerNode(context);

      expect(node.getOrientationX() instanceof AudioParam).toBeTruthy();
      expect(node.getOrientationX().getValue()).toBe(0);
    });

    it('.orientationY', () => {
      const node = new SpatialPannerNode(context);

      expect(node.getOrientationY() instanceof AudioParam).toBeTruthy();
      expect(node.getOrientationY().getValue()).toBe(0);
    });

    it('.orientationZ', () => {
      const node = new SpatialPannerNode(context);

      expect(node.getOrientationZ() instanceof AudioParam).toBeTruthy();
      expect(node.getOrientationZ().getValue()).toBe(0);
    });
  });
});
