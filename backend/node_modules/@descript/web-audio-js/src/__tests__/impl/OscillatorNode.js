'use strict';

import AudioContext from '../../impl/AudioContext';
import OscillatorNode from '../../impl/OscillatorNode';
import AudioNode from '../../impl/AudioNode';
import AudioSourceNode from '../../impl/AudioSourceNode';
import PeriodicWave from '../../impl/PeriodicWave';
import AudioParam from '../../impl/AudioParam';

describe('impl/OscillatorNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new OscillatorNode(context);

    expect(node instanceof OscillatorNode).toBeTruthy();
    expect(node instanceof AudioSourceNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new OscillatorNode(context);

      expect(node.getNumberOfInputs()).toBe(0);
    });

    it('.numberOfOutputs', () => {
      const node = new OscillatorNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.startTime', () => {
      const node = new OscillatorNode(context);

      expect(node.getStartTime()).toBe(undefined);
    });

    it('.stopTime', () => {
      const node = new OscillatorNode(context);

      expect(node.getStopTime()).toBe(undefined);
    });

    it('.playbackState', () => {
      const node = new OscillatorNode(context);

      expect(node.getPlaybackState()).toBe('unscheduled');
    });

    it('.type=', () => {
      const node = new OscillatorNode(context);

      expect(node.getType()).toBe('sine');

      ['sine', 'square', 'sawtooth', 'triangle'].forEach((type) => {
        node.setType(type);
        expect(node.getType()).toBe(type);
      });
    });

    it('.frequency', () => {
      const node = new OscillatorNode(context);

      expect(node.getFrequency() instanceof AudioParam).toBeTruthy();
      expect(node.getFrequency().getValue()).toBe(440);
    });

    it('.detune', () => {
      const node = new OscillatorNode(context);

      expect(node.getDetune() instanceof AudioParam).toBeTruthy();
      expect(node.getDetune().getValue()).toBe(0);
    });

    it('periodicWave=', () => {
      const node = new OscillatorNode(context);
      const periodicWave = new PeriodicWave(context, {
        real: [0, 0],
        imag: [0, 1],
      });

      node.setPeriodicWave(periodicWave);
      expect(node.getPeriodicWave()).toBe(periodicWave);
      expect(node.getType()).toBe('custom');
    });
  });

  describe('methods', () => {
    function processTo(context, when) {
      const channelData = [
        new Float32Array(context.blockSize),
        new Float32Array(context.blockSize),
      ];

      context.resume();

      while (context.currentTime < when) {
        context.process(channelData, 0);
      }
    }

    it('.start(when)', () => {
      const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
      const node = new OscillatorNode(context);

      node.connect(context.getDestination());

      // 0....1....2....3....4....5....
      // |
      // currentTime
      expect(node.getStartTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      //      start
      //      |
      // 0....1....2....3....4....5....
      // |
      // currentTime
      node.start(1);
      expect(node.getStartTime()).toBe(1);
      expect(node.getPlaybackState()).toBe('scheduled');

      //      start
      //      |
      // 0....1....2....3....4....5....
      //      |
      //      currentTime
      node.start(2);
      processTo(context, 1);
      expect(node.getStartTime()).toBe(1);
      expect(node.getPlaybackState()).toBe('playing');

      //      start
      //      |
      // 0....1....2....3....4....5....
      //           |
      //           currentTime
      processTo(context, 2);
      expect(node.getPlaybackState()).toBe('playing');
    });

    it('.stop(when)', () => {
      const context = new AudioContext({ sampleRate: 8000, blockSize: 16 });
      const node = new OscillatorNode(context);
      const onended = jest.fn();

      node.connect(context.getDestination());
      node.addEventListener('ended', onended);

      // 0....1....2....3....4....5....
      // |
      // currentTime
      expect(node.getStopTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      // 0....1....2....3....4....5....
      // |
      // currentTime
      node.stop(0);
      expect(node.getStopTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //      |
      //      currentTime
      node.start(2);
      node.stop(4);
      processTo(context, 1);
      expect(node.getStartTime()).toBe(2);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('scheduled');

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //           |
      //           currentTime
      node.stop(5);
      processTo(context, 2);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('playing');

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //                |
      //                currentTime
      processTo(context, 3);
      expect(node.getPlaybackState()).toBe('playing');
      expect(onended).toHaveBeenCalledTimes(0);

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //                     |
      //                     currentTime
      processTo(context, 4);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);
    });
  });

  describe('channel configuration', () => {
    it('should be mono output', () => {
      const node1 = new OscillatorNode(context);
      const node2 = new AudioNode(context, {}, { inputs: [1] });

      // +-------+
      // | node1 | OscillatorNode
      // +--(1)--+
      //     |
      // +--(1)--+
      // | node2 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);
    });
  });
});
