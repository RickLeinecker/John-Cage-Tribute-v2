'use strict';

import AudioContext from '../../../api/BaseAudioContext';
import DynamicsCompressorNode from '../../../api/DynamicsCompressorNode';
import DynamicsCompressorData from '../../../__tests_helpers/DynamicsCompressorData';

describe('impl/dsp/DynamicsCompressor', () => {
  it('works', () => {
    const sampleRate = 44100;
    const length = 44100;
    const blockSize = 1024;
    const context = new AudioContext({
      sampleRate,
      blockSize,
      numberOfChannels: 1,
    });
    const node = new DynamicsCompressorNode(context);

    // Testing the "Classic Voiceover" preset
    // { threshold: -24, ratio: 1.5, attack: 0.15, release: 0.4, knee: 10 }

    node.attack.value = 0.15;
    node.ratio.value = 1.5;
    node.threshold.value = -24;
    node.release.value = 0.4;
    node.knee.value = 10;

    const buffer = context.createBuffer(1, length, sampleRate);
    const bufSrc = context.createBufferSource();

    const freq = 440;

    function val(t) {
      return Math.sin(2 * Math.PI * freq * t);
    }

    for (let i = 0; i < length; i++) {
      buffer.getChannelData(0)[i] = val(i / sampleRate);
    }

    bufSrc.buffer = buffer;

    bufSrc.connect(node);
    node.connect(context.destination);
    const iterations = Math.ceil(length / blockSize);
    const iterLength = iterations * blockSize;
    const channelData = [new Float32Array(iterLength)];
    bufSrc.start();
    context.resume();

    for (let i = 0; i < iterations; i++) {
      context._impl.process(channelData, i * blockSize);
    }

    const out = channelData[0].slice(0, length);

    expect(out.length).toBe(length);
    for (let i = 0; i < out.length; i++) {
      const a = out[i];
      const b = DynamicsCompressorData[i];
      expect(Math.abs(a - b) <= 1e-4).toBeTruthy();
    }
  });
});
