'use strict';

import fill from '../../../utils/utils/fill';

describe('utils/fill(list, value)', () => {
  it('fill value', () => {
    const list = new Float32Array(8);
    const actual = fill(list, 1);
    const expected = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1]);

    expect(actual).toEqual(expected);
    expect(list).toEqual(expected);
  });

  it('fill value - polyfill ver', () => {
    const list = new Float32Array(8);

    // kill native function
    Object.defineProperty(list, 'fill', { value: null });

    const actual = fill(list, 1);
    const expected = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1]);

    expect(actual).toEqual(expected);
    expect(list).toEqual(expected);
  });
});
