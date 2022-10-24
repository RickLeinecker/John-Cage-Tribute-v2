'use strict';

import AudioContext from '../../../impl/AudioContext';
import IIRFilterNode from '../../../impl/IIRFilterNode';

function closeTo(a, b, delta) {
  return Math.abs(a - b) <= delta;
}

describe('impl/dsp/IIRFilterNode', () => {
  describe('getFrequencyResponse(frequencyHz, magResponse, phaseResponse)', () => {
    it('works', () => {
      const context = new AudioContext({ sampleRate: 44100, blockSize: 16 });
      const node = new IIRFilterNode(context, {
        feedforward: [0.135784, 0.0, -0.135784],
        feedback: [1, -1.854196, 0.932108],
      });
      const frequencyHz = new Float32Array([1000, 2000, 3000]);
      const magResponse = new Float32Array(3);
      const phaseResponse = new Float32Array(3);

      node.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

      // computed using Chrome 54
      // a=a||new AudioContext(); b=a.createIIRFilter([ 0.135784, 0.000000, -0.135784 ], [ 1, -1.854196, 0.932108 ]); c=new Float32Array([ 1000, 2000, 3000 ]); d=new Float32Array(3); e=new Float32Array(3); b.getFrequencyResponse(c, d, e); console.log(d); console.log(e);
      const magExpected = new Float32Array([
        0.6521847248077393,
        4,
        1.1262547969818115,
      ]);
      const phaseExpected = new Float32Array([
        1.4070188999176025,
        0.00000937021650315728,
        -1.2853729724884033,
      ]);

      expect(
        magResponse.every((mag, i) => closeTo(mag, magExpected[i], 1e-6)),
      ).toBeTruthy();
      expect(
        phaseResponse.every((phase, i) =>
          closeTo(phase, phaseExpected[i], 1e-6),
        ),
      ).toBeTruthy();
    });
  });
});
