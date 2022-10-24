'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';

class ChannelMergerNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.ChannelMergerNode(context._impl, opts);
  }
}

export default ChannelMergerNode;
