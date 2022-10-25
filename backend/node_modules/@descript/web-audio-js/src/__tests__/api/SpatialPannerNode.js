'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';
import AudioParam from '../../api/AudioParam';

describe('api/SpatialPannerNode', () => {
  it('context.createSpatialPanner()', () => {
    const context = new AudioContext();
    const target = context.createSpatialPanner();

    expect(target instanceof api.SpatialPannerNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.panningModel=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const panningModel1 = 'equalpower';
      const panningModel2 = 'HRTF';

      target._impl.getPanningModel = jest.fn(() => panningModel1);
      target._impl.setPanningModel = jest.fn();

      expect(target.panningModel).toBe(panningModel1);
      expect(target._impl.getPanningModel).toHaveBeenCalledTimes(1);

      target.panningModel = panningModel2;
      expect(target._impl.setPanningModel).toHaveBeenCalledTimes(1);
      expect(target._impl.setPanningModel.mock.calls[0][0]).toBe(panningModel2);
    });

    it('.positionX', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();

      expect(target.positionX instanceof AudioParam).toBeTruthy();
      expect(target.positionX).toBe(target._impl.$positionX);
    });

    it('.positionY', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();

      expect(target.positionY instanceof AudioParam).toBeTruthy();
      expect(target.positionY).toBe(target._impl.$positionY);
    });

    it('.positionZ', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();

      expect(target.positionZ instanceof AudioParam).toBeTruthy();
      expect(target.positionZ).toBe(target._impl.$positionZ);
    });

    it('.orientationX', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();

      expect(target.orientationX instanceof AudioParam).toBeTruthy();
      expect(target.orientationX).toBe(target._impl.$orientationX);
    });

    it('.orientationY', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();

      expect(target.orientationY instanceof AudioParam).toBeTruthy();
      expect(target.orientationY).toBe(target._impl.$orientationY);
    });

    it('.orientationZ', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();

      expect(target.orientationZ instanceof AudioParam).toBeTruthy();
      expect(target.orientationZ).toBe(target._impl.$orientationZ);
    });

    it('.distanceModel=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const distanceModel1 = 'inverse';
      const distanceModel2 = 'linear';

      target._impl.getDistanceModel = jest.fn(() => distanceModel1);
      target._impl.setDistanceModel = jest.fn();

      expect(target.distanceModel).toBe(distanceModel1);
      expect(target._impl.getDistanceModel).toHaveBeenCalledTimes(1);

      target.distanceModel = distanceModel2;
      expect(target._impl.setDistanceModel).toHaveBeenCalledTimes(1);
      expect(target._impl.setDistanceModel.mock.calls[0][0]).toBe(
        distanceModel2,
      );
    });

    it('.refDistance=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const refDistance1 = 1;
      const refDistance2 = 0.8;

      target._impl.getRefDistance = jest.fn(() => refDistance1);
      target._impl.setRefDistance = jest.fn();

      expect(target.refDistance).toBe(refDistance1);
      expect(target._impl.getRefDistance).toHaveBeenCalledTimes(1);

      target.refDistance = refDistance2;
      expect(target._impl.setRefDistance).toHaveBeenCalledTimes(1);
      expect(target._impl.setRefDistance.mock.calls[0][0]).toBe(refDistance2);
    });

    it('.maxDistance=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const maxDistance1 = 10000;
      const maxDistance2 = 15000;

      target._impl.getMaxDistance = jest.fn(() => maxDistance1);
      target._impl.setMaxDistance = jest.fn();

      expect(target.maxDistance).toBe(maxDistance1);
      expect(target._impl.getMaxDistance).toHaveBeenCalledTimes(1);

      target.maxDistance = maxDistance2;
      expect(target._impl.setMaxDistance).toHaveBeenCalledTimes(1);
      expect(target._impl.setMaxDistance.mock.calls[0][0]).toBe(maxDistance2);
    });

    it('.rolloffFactor=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const rolloffFactor1 = 1;
      const rolloffFactor2 = 0.8;

      target._impl.getRolloffFactor = jest.fn(() => rolloffFactor1);
      target._impl.setRolloffFactor = jest.fn();

      expect(target.rolloffFactor).toBe(rolloffFactor1);
      expect(target._impl.getRolloffFactor).toHaveBeenCalledTimes(1);

      target.rolloffFactor = rolloffFactor2;
      expect(target._impl.setRolloffFactor).toHaveBeenCalledTimes(1);
      expect(target._impl.setRolloffFactor.mock.calls[0][0]).toBe(
        rolloffFactor2,
      );
    });

    it('.coneInnerAngle=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const coneInnerAngle1 = 360;
      const coneInnerAngle2 = 270;

      target._impl.getConeInnerAngle = jest.fn(() => coneInnerAngle1);
      target._impl.setConeInnerAngle = jest.fn();

      expect(target.coneInnerAngle).toBe(coneInnerAngle1);
      expect(target._impl.getConeInnerAngle).toHaveBeenCalledTimes(1);

      target.coneInnerAngle = coneInnerAngle2;
      expect(target._impl.setConeInnerAngle).toHaveBeenCalledTimes(1);
      expect(target._impl.setConeInnerAngle.mock.calls[0][0]).toBe(
        coneInnerAngle2,
      );
    });

    it('.coneOuterAngle=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const coneOuterAngle1 = 360;
      const coneOuterAngle2 = 270;

      target._impl.getConeOuterAngle = jest.fn(() => coneOuterAngle1);
      target._impl.setConeOuterAngle = jest.fn();

      expect(target.coneOuterAngle).toBe(coneOuterAngle1);
      expect(target._impl.getConeOuterAngle).toHaveBeenCalledTimes(1);

      target.coneOuterAngle = coneOuterAngle2;
      expect(target._impl.setConeOuterAngle).toHaveBeenCalledTimes(1);
      expect(target._impl.setConeOuterAngle.mock.calls[0][0]).toBe(
        coneOuterAngle2,
      );
    });

    it('.coneOuterGain=', () => {
      const context = new AudioContext();
      const target = context.createSpatialPanner();
      const coneOuterGain1 = 0;
      const coneOuterGain2 = 0.25;

      target._impl.getConeOuterGain = jest.fn(() => coneOuterGain1);
      target._impl.setConeOuterGain = jest.fn();

      expect(target.coneOuterGain).toBe(coneOuterGain1);
      expect(target._impl.getConeOuterGain).toHaveBeenCalledTimes(1);

      target.coneOuterGain = coneOuterGain2;
      expect(target._impl.setConeOuterGain).toHaveBeenCalledTimes(1);
      expect(target._impl.setConeOuterGain.mock.calls[0][0]).toBe(
        coneOuterGain2,
      );
    });
  });
});
