'use strict';

import AudioContext from '../../impl/AudioContext';
import PannerNode from '../../impl/PannerNode';
import BasePannerNode from '../../impl/BasePannerNode';

describe('impl/PannerNode', () => {
  let context;

  beforeEach(() => {
    context = new AudioContext({ sampleRate: 8000, blockSize: 32 });
  });

  it('constructor', () => {
    const node = new PannerNode(context);

    expect(node instanceof PannerNode).toBeTruthy();
    expect(node instanceof BasePannerNode).toBeTruthy();
  });
});
