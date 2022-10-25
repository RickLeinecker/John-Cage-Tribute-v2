'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';

class ChannelSplitterNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.ChannelSplitterNode(context._impl, opts);
  }
}

export default ChannelSplitterNode;
