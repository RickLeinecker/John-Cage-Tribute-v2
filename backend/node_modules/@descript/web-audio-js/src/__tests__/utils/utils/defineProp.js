'use strict';

import defineProp from '../../../utils/utils/defineProp';

describe('utils/defineProp', () => {
  it('define property', () => {
    const a = {};

    defineProp(a, 'value', 100);

    expect(a.value).toBe(100);
  });

  it('not enumerable', () => {
    const a = {};

    defineProp(a, 'value', 100);

    expect(Object.keys(a).length).toBe(0);
  });

  it('writable', () => {
    const a = {};

    defineProp(a, 'value', 100);

    a.value = 200;
    expect(a.value).toBe(200);
  });

  it('configurable', () => {
    const a = {};

    defineProp(a, 'value', 100);
    defineProp(a, 'value', 300);

    expect(a.value).toBe(300);
  });
});
