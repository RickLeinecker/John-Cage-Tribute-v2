'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/ChannelSplitterNode', () => {
  it('context.createChannelSplitter(numberOfOutputs)', () => {
    const context = new AudioContext();
    const target = context.createChannelSplitter(2);

    expect(target instanceof api.ChannelSplitterNode).toBeTruthy();
  });
});
