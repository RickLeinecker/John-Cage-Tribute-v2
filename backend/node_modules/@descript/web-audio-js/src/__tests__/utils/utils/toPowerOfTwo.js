'use strict';

import toPowerOfTwo from '../../../utils/utils/toPowerOfTwo';

describe('utils/toPowerOfTwo(value)', () => {
  it('convert to 2^n', () => {
    expect(toPowerOfTwo(1)).toBe(1);
    expect(toPowerOfTwo(2)).toBe(2);
    expect(toPowerOfTwo(3)).toBe(4);
    expect(toPowerOfTwo(3, Math.floor)).toBe(2);
    expect(toPowerOfTwo(3, Math.ceil)).toBe(4);
  });
});
