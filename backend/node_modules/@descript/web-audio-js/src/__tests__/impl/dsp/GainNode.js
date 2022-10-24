'use strict';

import * as np from '../../../__tests_helpers/np';
import AudioContext from '../../../impl/AudioContext';
import GainNode from '../../../impl/GainNode';
import AudioNode from '../../../impl/AudioNode';

const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });

describe('impl/GainNode', () => {
  const channelData = [new Float32Array(16), new Float32Array(16)];

  describe('channel: mono', () => {
    let node1, node2;

    beforeEach(() => {
      context.reset();
      context.resume();

      node1 = new AudioNode(context, {}, { outputs: [1] });
      node2 = new GainNode(context);
      node1.enableOutputsIfNecessary();
      node1.connect(node2);
      node2.connect(context.getDestination());
    });

    describe('hasSampleAccurateValues: false', () => {
      it('input: silent', () => {
        node1.outputs[0].bus.zeros();
        node2.getGain().setValue(1);
        context.process(channelData, 0);

        const actual = node2.outputs[0].bus.getChannelData()[0];
        const expected = np.zeros(16);

        expect(actual).toEqual(expected);
        expect(node2.outputs[0].bus.isSilent).toBe(true);
      });

      it('value: 0', () => {
        const noise = np.random_sample(16);

        node1.outputs[0].bus.getMutableData()[0].set(noise);
        node2.getGain().setValue(0);
        context.process(channelData, 0);

        const actual = node2.outputs[0].bus.getChannelData()[0];
        const expected = np.zeros(16);

        expect(actual).toEqual(expected);
        expect(node2.outputs[0].bus.isSilent).toBe(true);
      });

      it('value: 1', () => {
        const noise = np.random_sample(16);

        node1.outputs[0].bus.getMutableData()[0].set(noise);
        node2.getGain().setValue(1);
        context.process(channelData, 0);

        const actual = node2.outputs[0].bus.getChannelData()[0];
        const expected = noise;

        expect(actual).toEqual(expected);
        expect(node2.outputs[0].bus.isSilent).toBe(false);
      });

      it('value: 2', () => {
        const noise = np.random_sample(16);

        node1.outputs[0].bus.getMutableData()[0].set(noise);
        node2.getGain().setValue(2);
        context.process(channelData, 0);

        const actual = node2.outputs[0].bus.getChannelData()[0];
        const expected = noise.map((x) => x * 2);

        expect(actual).toEqual(expected);
        expect(node2.outputs[0].bus.isSilent).toBe(false);
      });
    });
    describe('hasSampleAccurateValues: true', () => {
      it('works', () => {
        const noise = np.random_sample(16);

        node1.outputs[0].bus.getMutableData()[0].set(noise);
        node2.getGain().setValueAtTime(0, 0);
        node2.getGain().linearRampToValueAtTime(1, 16 / 8000);
        context.process(channelData, 0);

        const actual = node2.outputs[0].bus.getChannelData()[0];
        const expected = noise.map((x, i) => x * (i / 16));

        expect(actual).toEqual(expected);
        expect(node2.outputs[0].bus.isSilent).toBe(false);
      });
    });

    describe('channel: stereo', () => {
      let node1, node2;

      beforeEach(() => {
        context.reset();
        context.resume();

        node1 = new AudioNode(context, {}, { outputs: [2] });
        node2 = new GainNode(context);
        node1.enableOutputsIfNecessary();
        node1.connect(node2);
        node2.connect(context.getDestination());
      });

      describe('hasSampleAccurateValues: false', () => {
        it('input: silent', () => {
          node1.outputs[0].bus.zeros();
          node2.getGain().setValue(1);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const expectedL = np.zeros(16);
          const expectedR = np.zeros(16);

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(node2.outputs[0].bus.isSilent).toBe(true);
        });

        it('value: 0', () => {
          const noiseL = np.random_sample(16);
          const noiseR = np.random_sample(16);

          node1.outputs[0].bus.getMutableData()[0].set(noiseL);
          node1.outputs[0].bus.getMutableData()[1].set(noiseR);
          node2.getGain().setValue(0);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const expectedL = np.zeros(16);
          const expectedR = np.zeros(16);

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(node2.outputs[0].bus.isSilent).toBe(true);
        });

        it('value: 1', () => {
          const noiseL = np.random_sample(16);
          const noiseR = np.random_sample(16);

          node1.outputs[0].bus.getMutableData()[0].set(noiseL);
          node1.outputs[0].bus.getMutableData()[1].set(noiseR);
          node2.getGain().setValue(1);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const expectedL = noiseL;
          const expectedR = noiseR;

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(node2.outputs[0].bus.isSilent).toBe(false);
        });

        it('value: 2', () => {
          const noiseL = np.random_sample(16);
          const noiseR = np.random_sample(16);

          node1.outputs[0].bus.getMutableData()[0].set(noiseL);
          node1.outputs[0].bus.getMutableData()[1].set(noiseR);
          node2.getGain().setValue(2);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const expectedL = noiseL.map((x) => x * 2);
          const expectedR = noiseR.map((x) => x * 2);

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(node2.outputs[0].bus.isSilent).toBe(false);
        });
      });
      describe('hasSampleAccurateValues: true', () => {
        it('works', () => {
          const noiseL = np.random_sample(16);
          const noiseR = np.random_sample(16);

          node1.outputs[0].bus.getMutableData()[0].set(noiseL);
          node1.outputs[0].bus.getMutableData()[1].set(noiseR);
          node2.getGain().setValueAtTime(0, 0);
          node2.getGain().linearRampToValueAtTime(1, 16 / 8000);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const expectedL = noiseL.map((x, i) => x * (i / 16));
          const expectedR = noiseR.map((x, i) => x * (i / 16));

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(node2.outputs[0].bus.isSilent).toBe(false);
        });
      });
    });

    describe('channel: else', () => {
      let node1, node2;

      beforeEach(() => {
        context.reset();
        context.resume();

        node1 = new AudioNode(context, {}, { outputs: [4] });
        node2 = new GainNode(context);
        node1.enableOutputsIfNecessary();
        node1.connect(node2);
        node2.connect(context.getDestination());
      });

      describe('hasSampleAccurateValues: false', () => {
        it('works', () => {
          const noiseL = np.random_sample(16);
          const noiseR = np.random_sample(16);
          const noiseSL = np.random_sample(16);
          const noiseSR = np.random_sample(16);

          node1.outputs[0].bus.getMutableData()[0].set(noiseL);
          node1.outputs[0].bus.getMutableData()[1].set(noiseR);
          node1.outputs[0].bus.getMutableData()[2].set(noiseSL);
          node1.outputs[0].bus.getMutableData()[3].set(noiseSR);
          node2.getGain().setValue(2);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const actualSL = node2.outputs[0].bus.getChannelData()[2];
          const actualSR = node2.outputs[0].bus.getChannelData()[3];
          const expectedL = noiseL.map((x) => x * 2);
          const expectedR = noiseR.map((x) => x * 2);
          const expectedSL = noiseSL.map((x) => x * 2);
          const expectedSR = noiseSR.map((x) => x * 2);

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(actualSL).toEqual(expectedSL);
          expect(actualSR).toEqual(expectedSR);
          expect(node2.outputs[0].bus.isSilent).toBe(false);
        });
      });
      describe('hasSampleAccurateValues: true', () => {
        it('works', () => {
          const noiseL = np.random_sample(16);
          const noiseR = np.random_sample(16);
          const noiseSL = np.random_sample(16);
          const noiseSR = np.random_sample(16);

          node1.outputs[0].bus.getMutableData()[0].set(noiseL);
          node1.outputs[0].bus.getMutableData()[1].set(noiseR);
          node1.outputs[0].bus.getMutableData()[2].set(noiseSL);
          node1.outputs[0].bus.getMutableData()[3].set(noiseSR);
          node2.getGain().setValueAtTime(0, 0);
          node2.getGain().linearRampToValueAtTime(1, 16 / 8000);
          context.process(channelData, 0);

          const actualL = node2.outputs[0].bus.getChannelData()[0];
          const actualR = node2.outputs[0].bus.getChannelData()[1];
          const actualSL = node2.outputs[0].bus.getChannelData()[2];
          const actualSR = node2.outputs[0].bus.getChannelData()[3];
          const expectedL = noiseL.map((x, i) => x * (i / 16));
          const expectedR = noiseR.map((x, i) => x * (i / 16));
          const expectedSL = noiseSL.map((x, i) => x * (i / 16));
          const expectedSR = noiseSR.map((x, i) => x * (i / 16));

          expect(actualL).toEqual(expectedL);
          expect(actualR).toEqual(expectedR);
          expect(actualSL).toEqual(expectedSL);
          expect(actualSR).toEqual(expectedSR);
          expect(node2.outputs[0].bus.isSilent).toBe(false);
        });
      });
    });
  });
});
