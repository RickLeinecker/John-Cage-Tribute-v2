'use strict';

import AudioContext from '../../impl/AudioContext';
import BasePannerNode from '../../impl/BasePannerNode';
import AudioNode from '../../impl/AudioNode';

describe('impl/BasePannerNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new BasePannerNode(context);

    expect(node instanceof BasePannerNode).toBeTruthy();
    expect(node instanceof AudioNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new BasePannerNode(context);

      expect(node.getNumberOfInputs()).toBe(1);
    });

    it('.numberOfOutputs', () => {
      const node = new BasePannerNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.channelCount=', () => {
      const node = new BasePannerNode(context);

      expect(node.getChannelCount()).toBe(2);

      node.setChannelCount(1);
      expect(node.getChannelCount()).toBe(1);
    });

    it('.channelCountMode=', () => {
      const node = new BasePannerNode(context);

      expect(node.getChannelCountMode()).toBe('clamped-max');

      node.setChannelCountMode('explicit');
      expect(node.getChannelCountMode()).toBe('explicit');
    });

    it('.panningModel=', () => {
      const node = new BasePannerNode(context);

      expect(node.getPanningModel()).toBe('equalpower');

      ['equalpower', 'HRTF'].forEach((panningModel) => {
        node.setPanningModel(panningModel);
        expect(node.getPanningModel()).toBe(panningModel);
      });
    });

    it('.distanceModel=', () => {
      const node = new BasePannerNode(context);

      expect(node.getDistanceModel()).toBe('inverse');

      ['inverse', 'linear', 'exponential'].forEach((distanceModel) => {
        node.setDistanceModel(distanceModel);
        expect(node.getDistanceModel()).toBe(distanceModel);
      });
    });

    it('.refDistance=', () => {
      const node = new BasePannerNode(context);

      expect(node.getRefDistance()).toBe(1);

      node.setRefDistance(2);
      expect(node.getRefDistance()).toBe(2);
    });

    it('.maxDistance=', () => {
      const node = new BasePannerNode(context);

      expect(node.getMaxDistance()).toBe(10000);

      node.setMaxDistance(20000);
      expect(node.getMaxDistance()).toBe(20000);
    });

    it('.rolloffFactor=', () => {
      const node = new BasePannerNode(context);

      expect(node.getRolloffFactor()).toBe(1);

      node.setRolloffFactor(0.8);
      expect(node.getRolloffFactor()).toBe(0.8);
    });

    it('.coneInnerAngle=', () => {
      const node = new BasePannerNode(context);

      expect(node.getConeInnerAngle()).toBe(360);

      node.setConeInnerAngle(270);
      expect(node.getConeInnerAngle()).toBe(270);
    });

    it('.coneOuterAngle=', () => {
      const node = new BasePannerNode(context);

      expect(node.getConeOuterAngle()).toBe(360);

      node.setConeOuterAngle(270);
      expect(node.getConeOuterAngle()).toBe(270);
    });

    it('.coneOuterGain=', () => {
      const node = new BasePannerNode(context);

      expect(node.getConeOuterGain()).toBe(0);

      node.setConeOuterGain(0.1);
      expect(node.getConeOuterGain()).toBe(0.1);
    });
  });

  describe('channel configuration', () => {
    it('should be always 2ch', () => {
      const node1 = new AudioNode(context, {}, { outputs: [4] });
      const node2 = new BasePannerNode(context);
      const node3 = new AudioNode(context, {}, { inputs: [1] });

      node1.outputs[0].enable();
      node2.outputs[0].enable();

      // +-------+
      // | node1 |
      // +--(4)--+
      //
      // +--(1)--+
      // | node2 | BasePannerNode
      // +--(2)--+
      //     |
      // +--(2)--+
      // | node3 |
      // +-------+
      node2.connect(node3);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(2);

      // +-------+
      // | node1 |
      // +--(4)--+
      //     |
      // +--(2)--+
      // | node2 | BasePannerNode
      // +--(2)--+
      //     |
      // +--(2)--+
      // | node3 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(2);
      expect(node3.inputs[0].getNumberOfChannels()).toBe(2);
    });
  });
});
