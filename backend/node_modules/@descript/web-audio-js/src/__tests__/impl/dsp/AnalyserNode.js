'use strict';

import * as np from '../../../__tests_helpers/np';
import AudioContext from '../../../impl/AudioContext';
import AnalyserNode from '../../../impl/AnalyserNode';
import OscillatorNode from '../../../impl/OscillatorNode';

const context = new AudioContext({ sampleRate: 8000, blockSize: 32 });

// test nodes
let oscillator;
let analyser;
let channel;
let channels;

describe('impl/AnalyserNode', () => {
  beforeEach(() => {
    channel = new Float32Array(context.blockSize);
    channels = [channel];

    // create nodes
    oscillator = new OscillatorNode(context);
    analyser = new AnalyserNode(context);
    analyser.setFftSize(context.blockSize);

    // connect nodes
    oscillator.connect(analyser);
    analyser.connect(context.getDestination());

    // resume
    oscillator.start();
    context.resume();
  });

  afterEach(() => {
    analyser.disconnect(context.getDestination());
    oscillator.disconnect(analyser);
  });

  it('should get time domain data (float)', () => {
    const waveform = new Float32Array(channel.length);

    analyser.getFloatTimeDomainData(waveform);
    expect(waveform).toEqual(np.zeros(waveform.length));

    context.process(channels, 0);
    analyser.getFloatTimeDomainData(waveform);

    expect(waveform).toEqual(channel);
  });

  it('should get time domain data (byte)', () => {
    const waveform = new Uint8Array(channel.length);

    analyser.getByteTimeDomainData(waveform);
    expect(waveform).toEqual(np.full(waveform.length, 128, Uint8Array));

    context.process(channels, 0);
    analyser.getByteTimeDomainData(waveform);

    expect([...waveform]).toEqual([
      128,
      171,
      209,
      237,
      253,
      253,
      239,
      212,
      174,
      132,
      88,
      49,
      20,
      3,
      1,
      14,
      40,
      77,
      119,
      163,
      202,
      233,
      251,
      254,
      243,
      218,
      182,
      139,
      96,
      56,
      24,
      5,
    ]);
  });

  it('should get frequency data (float)', () => {
    const spectrum = new Float32Array(channel.length);

    analyser.getFloatFrequencyData(spectrum);
    expect(spectrum).toEqual(np.zeros(spectrum.length));

    context.process(channels, 0);
    analyser.getFloatFrequencyData(spectrum);

    expect(spectrum[0]).toBe(-31.810009002685547);
    expect(spectrum[4]).toBe(-52.464996337890625);
    expect(spectrum[8]).toBe(-99.65359497070312);
    expect(spectrum[15]).toBe(-114.25790405273438);
  });

  it('should get frequency data (byte)', () => {
    const spectrum = new Uint8Array(channel.length);

    analyser.getByteFrequencyData(spectrum);
    // expect(spectrum).toEqual(np.full(spectrum.length, 255));

    context.process(channels, 0);
    analyser.getByteFrequencyData(spectrum);

    expect(spectrum[0]).toBe(248);
    expect(spectrum[4]).toBe(173);
    expect(spectrum[8]).toBe(1);
    expect(spectrum[15]).toBe(0);
  });
});
