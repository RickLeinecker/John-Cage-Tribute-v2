'use strict';

import toImpl from '../../../utils/utils/toImpl';

describe('utils/toImpl(value)', () => {
  it('convert to impl', () => {
    const impl = {};
    const value = { _impl: impl };
    const actual = toImpl(value);
    const expected = impl;

    expect(actual).toBe(expected);
  });

  it('nothing to do', () => {
    const impl = {};
    const actual = toImpl(impl);
    const expected = impl;

    expect(actual).toBe(expected);
  });
});
