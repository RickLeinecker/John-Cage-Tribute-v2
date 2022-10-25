'use strict';

import AudioNode from './AudioNode';

class AudioDestinationNode extends AudioNode {
  constructor(context, impl) {
    super(context);

    this._impl = impl;
  }

  get maxChannelCount() {
    return this._impl.getMaxChannelCount();
  }
}

export default AudioDestinationNode;
