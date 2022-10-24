'use strict';

import toValidSampleRate from '../../../utils/utils/toValidSampleRate';

describe('utils/toValidSampleRate()', () => {
  it('return valid sampleRate', () => {
    expect(toValidSampleRate(0)).toBe(3000);
    expect(toValidSampleRate(5512.5)).toBe(5512);
    expect(toValidSampleRate(44100)).toBe(44100);
    expect(toValidSampleRate(48000)).toBe(48000);
    expect(toValidSampleRate(Infinity)).toBe(192000);
  });
});
