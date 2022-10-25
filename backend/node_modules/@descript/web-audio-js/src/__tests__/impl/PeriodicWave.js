'use strict';

import AudioContext from '../../impl/AudioContext';
import PeriodicWave from '../../impl/PeriodicWave';

const real = new Float32Array([0, 0]);
const imag = new Float32Array([0, 1]);

describe('impl/PeriodicWave', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new PeriodicWave(context, { real, imag });

    expect(node instanceof PeriodicWave).toBeTruthy();
  });

  describe('attributes', () => {
    it('.constraints', () => {
      const node = new PeriodicWave(context, { real, imag });

      expect(node.getConstraints()).toBe(false);
    });

    it('.real', () => {
      const node = new PeriodicWave(context, { real, imag });

      expect(node.getReal()).toBe(real);
    });

    it('.imag', () => {
      const node = new PeriodicWave(context, { real, imag });

      expect(node.getImag()).toBe(imag);
    });
  });

  describe('generate basic waveform', () => {
    const periodicWave = new PeriodicWave(context, {
      real: [0, 0],
      imag: [0, 1],
    });

    [
      { type: 'sine', expected: 'sine' },
      { type: 'sawtooth', expected: 'sawtooth' },
      { type: 'triangle', expected: 'triangle' },
      { type: 'square', expected: 'square' },
      { type: 'unknown', expected: 'custom' },
    ].forEach(({ type, expected }) => {
      it(type, () => {
        periodicWave.generateBasicWaveform(type);
        expect(periodicWave.getName()).toBe(expected);
      });
    });
  });
});
