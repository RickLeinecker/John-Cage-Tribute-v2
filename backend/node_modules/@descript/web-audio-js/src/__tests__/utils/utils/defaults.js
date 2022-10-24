'use strict';

import defaults from '../../../utils/utils/defaults';

describe('utils/defaults(value, defaultValue)', () => {
  it('works', () => {
    expect(defaults(0, 1)).toBe(0);
    expect(defaults(null, 1)).toBe(null);
    expect(defaults(undefined, 1)).toBe(1);
  });
});
