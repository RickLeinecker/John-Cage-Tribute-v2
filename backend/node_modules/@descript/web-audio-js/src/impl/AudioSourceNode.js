'use strict';

import assert from 'assert';
import AudioNode from './AudioNode';

/* istanbul ignore next */
class AudioSourceNode extends AudioNode {
  /**
   * @param {AudioContext} context
   */
  constructor(context, opts) {
    super(context, opts, {
      inputs: [],
      outputs: [1],
    });
  }

  enableOutputsIfNecessary() {
    assert(!'SHOULD NOT BE CALLED');
  }

  disableOutputsIfNecessary() {
    assert(!'SHOULD NOT BE CALLED');
  }
}

export default AudioSourceNode;
