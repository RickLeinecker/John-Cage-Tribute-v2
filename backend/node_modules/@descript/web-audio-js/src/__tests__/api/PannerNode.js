'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/PannerNode', () => {
  it('context.createPanner()', () => {
    const context = new AudioContext();
    const target = context.createPanner();

    expect(target instanceof api.PannerNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.panningModel=', () => {
      const context = new AudioContext();
      const target = context.createPanner();
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

    it('.distanceModel=', () => {
      const context = new AudioContext();
      const target = context.createPanner();
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
      const target = context.createPanner();
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
      const target = context.createPanner();
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
      const target = context.createPanner();
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
      const target = context.createPanner();
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
      const target = context.createPanner();
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
      const target = context.createPanner();
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

  describe('methods', () => {
    it('.setPosition(x, y, z)', () => {
      const context = new AudioContext();
      const target = context.createPanner();
      const x = 0;
      const y = 1;
      const z = 2;

      target._impl.setPosition = jest.fn();

      target.setPosition(x, y, z);
      expect(target._impl.setPosition).toHaveBeenCalledTimes(1);
      expect(target._impl.setPosition.mock.calls[0][0]).toBe(x);
      expect(target._impl.setPosition.mock.calls[0][1]).toBe(y);
      expect(target._impl.setPosition.mock.calls[0][2]).toBe(z);
    });

    it('.setOrientation(x, y, z)', () => {
      const context = new AudioContext();
      const target = context.createPanner();
      const x = 0;
      const y = 1;
      const z = 2;

      target._impl.setOrientation = jest.fn();

      target.setOrientation(x, y, z);
      expect(target._impl.setOrientation).toHaveBeenCalledTimes(1);
      expect(target._impl.setOrientation.mock.calls[0][0]).toBe(x);
      expect(target._impl.setOrientation.mock.calls[0][1]).toBe(y);
      expect(target._impl.setOrientation.mock.calls[0][2]).toBe(z);
    });

    it('.setVelocity(x, y, z)', () => {
      const context = new AudioContext();
      const target = context.createPanner();
      const x = 0;
      const y = 1;
      const z = 2;

      target._impl.setVelocity = jest.fn();

      target.setVelocity(x, y, z);
      expect(target._impl.setVelocity).toHaveBeenCalledTimes(1);
      expect(target._impl.setVelocity.mock.calls[0][0]).toBe(x);
      expect(target._impl.setVelocity.mock.calls[0][1]).toBe(y);
      expect(target._impl.setVelocity.mock.calls[0][2]).toBe(z);
    });
  });
});
