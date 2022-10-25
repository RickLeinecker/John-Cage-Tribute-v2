'use strict';

import toValidBlockSize from '../../../utils/utils/toValidBlockSize';

describe('utils/toValidBlockSize()', () => {
  it('return valid block size', () => {
    expect(toValidBlockSize(0)).toBe(8);
    expect(toValidBlockSize(8)).toBe(8);
    expect(toValidBlockSize(128)).toBe(128);
    expect(toValidBlockSize(500)).toBe(512);
    expect(toValidBlockSize(2000)).toBe(1024);
  });
});
