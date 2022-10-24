'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/ChannelMergerNode', () => {
  it('context.createChannelMerger(numberOfInputs)', () => {
    const context = new AudioContext();
    const target = context.createChannelMerger(2);

    expect(target instanceof api.ChannelMergerNode).toBeTruthy();
  });
});
