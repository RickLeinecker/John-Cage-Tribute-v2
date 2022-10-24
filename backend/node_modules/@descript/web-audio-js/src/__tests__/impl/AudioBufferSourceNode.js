'use strict';

import AudioContext from '../../impl/AudioContext';
import AudioBufferSourceNode from '../../impl/AudioBufferSourceNode';
import AudioNode from '../../impl/AudioNode';
import AudioSourceNode from '../../impl/AudioSourceNode';
import AudioBuffer from '../../impl/AudioBuffer';
import AudioParam from '../../impl/AudioParam';

describe('impl/AudioBufferSourceNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new AudioBufferSourceNode(context);

    expect(node instanceof AudioBufferSourceNode).toBeTruthy();
    expect(node instanceof AudioSourceNode).toBeTruthy();
  });

  describe('attributes', () => {
    it('.numberOfInputs', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getNumberOfInputs()).toBe(0);
    });

    it('.numberOfOutputs', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getNumberOfOutputs()).toBe(1);
    });

    it('.startTime', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getStartTime()).toBe(undefined);
    });

    it('.stopTime', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getStopTime()).toBe(undefined);
    });

    it('.playbackState', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getPlaybackState()).toBe('unscheduled');
    });

    it('.buffer=', () => {
      const node = new AudioBufferSourceNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 32,
        sampleRate: 8000,
      });

      expect(node.getBuffer()).toBe(null);

      node.setBuffer(buffer);
      expect(node.getBuffer()).toBe(buffer);
    });

    it('.playbackRate', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getPlaybackRate() instanceof AudioParam).toBeTruthy();
      expect(node.getPlaybackRate().getValue()).toBe(1);
    });

    it('.detune', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getDetune() instanceof AudioParam).toBeTruthy();
      expect(node.getDetune().getValue()).toBe(0);
    });

    it('loop=', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getLoop()).toBe(false);

      node.setLoop(true);
      expect(node.getLoop()).toBe(true);
    });

    it('loopStart=', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getLoopStart()).toBe(0);

      node.setLoopStart(1);
      expect(node.getLoopStart()).toBe(1);
    });

    it('loopEnd=', () => {
      const node = new AudioBufferSourceNode(context);

      expect(node.getLoopEnd()).toBe(0);

      node.setLoopEnd(1);
      expect(node.getLoopEnd()).toBe(1);
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
      const node = new AudioBufferSourceNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 8000,
        sampleRate: 8000,
      });

      node.setBuffer(buffer);
      node.setLoop(true);
      node.connect(context.getDestination());

      // 0....1....2....3....4....5....
      // |
      // currentTime
      expect(node.getStartTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      //      start
      //      |
      // 0....1....2....3....4....5....
      // |    =======================.. buffer
      // |
      // currentTime
      node.start(1);
      expect(node.getStartTime()).toBe(1);
      expect(node.getStartOffset()).toBe(0);
      expect(node.getStartDuration()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('scheduled');

      //      start
      //      |
      // 0....1....2....3....4....5....
      //      |======================.. buffer
      //      |
      //      currentTime
      node.start(2);
      processTo(context, 1);
      expect(node.getStartTime()).toBe(1);
      expect(node.getPlaybackState()).toBe('playing');

      //      start
      //      |
      // 0....1....2....3....4....5....
      //      =====|=================.. buffer
      //           |
      //           currentTime
      processTo(context, 2);
      expect(node.getPlaybackState()).toBe('playing');
    });

    it('.start(when, offset, duration)', () => {
      const node = new AudioBufferSourceNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 8000,
        sampleRate: 8000,
      });
      const onended = jest.fn();

      node.setBuffer(buffer);
      node.setLoop(true);
      node.connect(context.getDestination());
      node.addEventListener('ended', onended);

      // 0....1....2....3....4....5....
      // |
      // currentTime
      expect(node.getStopTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //      |    ==================..  buffer
      //      |
      //      currentTime
      node.start(2, 0.5, 1);
      node.stop(4);
      processTo(context, 1);
      expect(node.getStartTime()).toBe(2);
      expect(node.getStartOffset()).toBe(0.5);
      expect(node.getStartDuration()).toBe(1);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('scheduled');

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //           |=================..  buffer
      //           |
      //           currentTime
      node.stop(5);
      processTo(context, 2);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('playing');

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //           =====|============..  buffer
      //                |
      //                currentTime
      processTo(context, 3);
      expect(node.getPlaybackState()).toBe('playing');
      expect(onended).toHaveBeenCalledTimes(0);

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //           ==========|=======..  buffer
      //                     |
      //                     currentTime
      processTo(context, 4);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);
    });

    it('.start(when) without buffer', () => {
      const node = new AudioBufferSourceNode(context);
      const onended = jest.fn();

      node.connect(context.getDestination());
      node.addEventListener('ended', onended);

      // 0....1....2....3....4....5....
      // |
      // currentTime
      expect(node.getStartTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      //      start     stop
      //      |         |
      // 0....1....2....3....4....5....
      // |
      // currentTime
      node.start(1);
      node.stop(3);
      expect(node.getStartTime()).toBe(1);
      expect(node.getStopTime()).toBe(3);
      expect(node.getPlaybackState()).toBe('scheduled');
      expect(onended).toHaveBeenCalledTimes(0);

      //      start     stop
      //      |         |
      // 0....1....2....3....4....5....
      //      |
      //      currentTime
      processTo(context, 1);
      expect(node.getPlaybackState()).toBe('playing');
      expect(onended).toHaveBeenCalledTimes(0);

      //      start     stop
      //      |         |
      // 0....1....2....3....4....5....
      //           |
      //           currentTime
      processTo(context, 2);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);

      //      start     stop
      //      |         |
      // 0....1....2....3....4....5....
      //                |
      //                currentTime
      processTo(context, 3);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);
    });

    it('.start(when) auto stop by buffer duration', () => {
      const node = new AudioBufferSourceNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 8000,
        sampleRate: 8000,
      });
      const onended = jest.fn();

      node.setBuffer(buffer);
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
      //      |    =====                 buffer
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
      //           |====                 buffer
      //           |
      //           currentTime
      node.stop(5);
      processTo(context, 2);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('playing');

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //           =====|                buffer
      //                |
      //                currentTime
      processTo(context, 3);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //           =====     |           buffer
      //                     |
      //                     currentTime
      processTo(context, 4);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);
    });

    it('.start(when, offset, duration) auto stop by buffer duration', () => {
      const node = new AudioBufferSourceNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 8000,
        sampleRate: 8000,
      });
      const onended = jest.fn();

      node.setBuffer(buffer);
      node.connect(context.getDestination());
      node.addEventListener('ended', onended);

      // 0....1....2....3....4....5....
      // |
      // currentTime
      expect(node.getStopTime()).toBe(undefined);
      expect(node.getPlaybackState()).toBe('unscheduled');

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //      |    ==================..  buffer
      //      |
      //      currentTime
      node.start(2, 0.5, 1);
      node.stop(4);
      processTo(context, 1);
      expect(node.getStartTime()).toBe(2);
      expect(node.getStartOffset()).toBe(0.5);
      expect(node.getStartDuration()).toBe(1);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('scheduled');

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //           |=================..  buffer
      //           |
      //           currentTime
      node.stop(5);
      processTo(context, 2);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('playing');

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //           =====|============..  buffer
      //                |
      //                currentTime
      processTo(context, 3);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);

      //           start     stop
      //           |--->|    |
      // 0....1....2....3....4....5....
      //           ==========|=======..  buffer
      //                     |
      //                     currentTime
      processTo(context, 4);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);
    });

    it('.stop(when)', () => {
      const node = new AudioBufferSourceNode(context);
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 8000,
        sampleRate: 8000,
      });
      const onended = jest.fn();

      node.setBuffer(buffer);
      node.setLoop(true);
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
      //      |    ==================.. buffer
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
      //           |=================.. buffer
      //           |
      //           currentTime
      node.stop(5);
      processTo(context, 2);
      expect(node.getStopTime()).toBe(4);
      expect(node.getPlaybackState()).toBe('playing');

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //      ==========|============.. buffer
      //                |
      //                currentTime
      processTo(context, 3);
      expect(node.getPlaybackState()).toBe('playing');
      expect(onended).toHaveBeenCalledTimes(0);

      //           start     stop
      //           |         |
      // 0....1....2....3....4....5....
      //      ===============|=======.. buffer
      //                     |
      //                     currentTime
      processTo(context, 4);
      expect(node.getPlaybackState()).toBe('finished');
      expect(onended).toHaveBeenCalledTimes(1);
    });
  });

  describe('channel configuration', () => {
    it('should synchronize with the buffer if set', () => {
      const node1 = new AudioBufferSourceNode(context);
      const node2 = new AudioNode(context, {}, { inputs: [1] });
      const buffer = new AudioBuffer({
        numberOfChannels: 2,
        length: 32,
        sampleRate: 8000,
      });

      node1.outputs[0].enable();

      // +-------+
      // | node1 | AudioBufferSourceNode (buffer=null)
      // +--(1)--+
      //     |
      // +--(1)--+
      // | node2 |
      // +-------+
      node1.connect(node2);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(1);

      // +-------+
      // | node1 | AudioBufferSourceNode (buffer=ch[2])
      // +--(2)--+
      //     |
      // +--(2)--+
      // | node2 |
      // +-------+
      node1.setBuffer(buffer);
      expect(node2.inputs[0].getNumberOfChannels()).toBe(
        buffer.getNumberOfChannels(),
      );
    });
  });
});
