'use strict';

import OfflineAudioContext from '../../context/OfflineAudioContext';
import AudioBuffer from '../../api/AudioBuffer';

describe('OfflineAudioContext', () => {
  it('should return an OfflineAudioContext instance', () => {
    const context = new OfflineAudioContext(2, 128, 44100);

    expect(context instanceof OfflineAudioContext).toBeTruthy();
    expect(context.length).toBe(128);
    expect(context.sampleRate).toBe(44100);
  });

  it("should emit a 'complete' event with AudioBuffer after rendering", (done) => {
    const context = new OfflineAudioContext(2, 1000, 44100);
    const oncomplete = (e) => {
      const audioBuffer = e.renderedBuffer;

      expect(audioBuffer instanceof AudioBuffer).toBeTruthy();
      expect(audioBuffer.numberOfChannels).toBe(2);
      expect(audioBuffer.length).toBe(1000);
      expect(audioBuffer.sampleRate).toBe(44100);
      done();
    };

    context.oncomplete = oncomplete;

    expect(context.oncomplete).toBe(oncomplete);

    context.startRendering();
  });

  it('should return Promise<AudioBuffer>', () => {
    const context = new OfflineAudioContext(2, 1000, 44100);

    return context.startRendering().then((audioBuffer) => {
      expect(audioBuffer instanceof AudioBuffer).toBeTruthy();
      expect(audioBuffer.numberOfChannels).toBe(2);
      expect(audioBuffer.length).toBe(1000);
      expect(audioBuffer.sampleRate).toBe(44100);
    });
  });

  it("should change context's state in each rendering phase", (done) => {
    const context = new OfflineAudioContext(2, 1000, 44100);

    expect(context.state).toBe('suspended');

    context.startRendering();

    expect(context.state).toBe('running');

    context.oncomplete = () => {
      expect(context.state).toBe('closed');
      done();
    };
  });

  it('should suspend rendering', (done) => {
    const context = new OfflineAudioContext(2, 44100, 44100);

    context.suspend(300 / 44100).then(() => {
      expect(context.state).toBe('suspended');
      context.oncomplete = () => {
        done();
      };
      context.resume();
    });
    context.startRendering();

    context.oncomplete = () => {
      throw new TypeError('SHOULD NOT REACHED');
    };
  });
});
