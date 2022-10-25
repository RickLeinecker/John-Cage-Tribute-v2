'use strict';

import toDecibel from '../../../utils/utils/toDecibel';

describe('utils/toDecibel(gainValue)', () => {
  it('convert gainValue to decibel', () => {
    expect(Math.round(toDecibel(3.162))).toBe(10);
    expect(Math.round(toDecibel(1.995))).toBe(6);
    expect(Math.round(toDecibel(1.413))).toBe(3);
    expect(Math.round(toDecibel(1.122))).toBe(1);
    expect(Math.round(toDecibel(1.0))).toBe(0);
    expect(Math.round(toDecibel(0.891))).toBe(-1);
    expect(Math.round(toDecibel(0.708))).toBe(-3);
    expect(Math.round(toDecibel(0.501))).toBe(-6);
  });
});
