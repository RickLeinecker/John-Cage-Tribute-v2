'use strict';

import toValidNumberOfChannels from '../../../utils/utils/toValidNumberOfChannels';

describe('utils/toValidNumberOfChannels()', () => {
  it('return valid number of channels', () => {
    expect(toValidNumberOfChannels(0)).toBe(1);
    expect(toValidNumberOfChannels(2)).toBe(2);
    expect(toValidNumberOfChannels(8)).toBe(8);
    expect(toValidNumberOfChannels(2000)).toBe(32);
  });
});
