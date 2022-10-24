'use strict';

import clamp from '../../../utils/utils/clamp';

describe('utils/clamp(value, minValue, maxValue)', () => {
  it('return clamped value in the range [minValue, maxValue]', () => {
    expect(clamp(0, 2, 4)).toBe(2);
    expect(clamp(1, 2, 4)).toBe(2);
    expect(clamp(2, 2, 4)).toBe(2);
    expect(clamp(3, 2, 4)).toBe(3);
    expect(clamp(4, 2, 4)).toBe(4);
    expect(clamp(5, 2, 4)).toBe(4);
    expect(clamp(6, 2, 4)).toBe(4);
  });
});
