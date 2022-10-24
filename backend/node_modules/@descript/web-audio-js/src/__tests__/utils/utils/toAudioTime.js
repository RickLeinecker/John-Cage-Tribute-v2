'use strict';

import toAudioTime from '../../../utils/utils/toAudioTime';

describe('utils/toAudioTime()', () => {
  it('return the provided value when provide positive number', () => {
    expect(toAudioTime(10)).toBe(10);
  });

  it('return 0 when provide a negative number', () => {
    expect(toAudioTime(-1)).toBe(0);
  });

  it('return 0 when provided infinite number', () => {
    expect(toAudioTime(Infinity)).toBe(0);
  });

  it("convert to number when provided format of 'ss.SSS'", () => {
    expect(toAudioTime('23.456')).toBe(23.456);
  });

  it("convert to number when provided format of 'mm:ss.SSS'", () => {
    expect(toAudioTime('01:23.456')).toBe(83.456);
  });

  it("convert to number when provided format of 'hh:mm:ss.SSS'", () => {
    expect(toAudioTime('00:01:23.456')).toBe(83.456);
  });

  it('return 0 when provided case', () => {
    expect(toAudioTime('UNKNOWN')).toBe(0);
  });
});
