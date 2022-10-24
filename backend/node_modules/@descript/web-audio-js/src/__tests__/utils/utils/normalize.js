'use strict';

import normalize from '../../../utils/utils/normalize';

describe('utils/normalize(val, min, max)', () => {
  it('normalize a value to something between 0 - 1', () => {
    expect(normalize(0, -100, 100)).toBe(0.5);
    expect(normalize(-100, -100, 100)).toBe(0);
    expect(normalize(-200, -100, 100)).toBe(0);
    expect(normalize(100, -100, 100)).toBe(1);
    expect(normalize(200, -100, 100)).toBe(1);
    expect(normalize(50, -100, 100)).toBe(0.75);
  });
});
