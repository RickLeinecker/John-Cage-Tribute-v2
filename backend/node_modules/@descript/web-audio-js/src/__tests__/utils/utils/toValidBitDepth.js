'use strict';

import toValidBitDepth from '../../../utils/utils/toValidBitDepth';

describe('utils/toValidBitDepth()', () => {
  it('return valid bit depth', () => {
    expect(toValidBitDepth(8)).toBe(8);
    expect(toValidBitDepth(16)).toBe(16);
    expect(toValidBitDepth(32)).toBe(32);
  });

  it('return the default bit depth 16 when provided an invalid bit depth', () => {
    expect(toValidBitDepth(0)).toBe(16);
    expect(toValidBitDepth(NaN)).toBe(16);
  });
});
