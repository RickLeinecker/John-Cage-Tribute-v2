'use strict';

import fillRange from '../../../utils/utils/fillRange';

describe('utils/fillRange(list, value, start, end)', () => {
  it('fill value', () => {
    const list = new Float32Array(8);
    const actual = fillRange(list, 1, 2, 6);
    const expected = new Float32Array([0, 0, 1, 1, 1, 1, 0, 0]);

    expect(actual).toEqual(expected);
    expect(list).toEqual(expected);
  });

  it('fill value - polyfill ver', () => {
    const list = new Float32Array(8);

    // kill native function
    Object.defineProperty(list, 'fill', { value: null });

    const actual = fillRange(list, 1, 2, 6);
    const expected = new Float32Array([0, 0, 1, 1, 1, 1, 0, 0]);

    expect(actual).toEqual(expected);
    expect(list).toEqual(expected);
  });
});
