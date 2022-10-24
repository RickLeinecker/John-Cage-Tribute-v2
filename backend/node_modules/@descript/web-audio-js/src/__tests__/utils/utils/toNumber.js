'use strict';

import toNumber from '../../../utils/utils/toNumber';

describe('utils/toNumber(value)', () => {
  it('convert to number', () => {
    expect(toNumber(1)).toBe(1);
    expect(toNumber(Infinity)).toBe(Infinity);
    expect(toNumber('1')).toBe(1);
    expect(toNumber(NaN)).toBe(0);
  });
});
