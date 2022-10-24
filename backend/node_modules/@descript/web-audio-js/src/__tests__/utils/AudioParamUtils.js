'use strict';

import * as AudioParamUtils from '../../utils/AudioParamUtils';
import {
  EXPONENTIAL_RAMP_TO_VALUE_AT_TIME,
  LINEAR_RAMP_TO_VALUE_AT_TIME,
  SET_TARGET_AT_TIME,
  SET_VALUE_AT_TIME,
  SET_VALUE_CURVE_AT_TIME,
} from '../../constants/AudioParamEvent';

function closeTo(a, b, delta) {
  return Math.abs(a - b) <= delta;
}

describe('utils/AudioParamUtils.computeValueAtTime(timeline: object[], time: number, defaultValue: number): number', () => {
  it('works', () => {
    // https://www.w3.org/TR/webaudio/#example1-AudioParam
    const curve = new Float32Array(44100).map((_, i) =>
      Math.sin((Math.PI * i) / 44100),
    );
    const timeline = [
      { type: SET_VALUE_AT_TIME, time: 0.0, args: [0.2, 0.0] },
      { type: SET_VALUE_AT_TIME, time: 0.1, args: [0.3, 0.1] },
      { type: SET_VALUE_AT_TIME, time: 0.2, args: [0.4, 0.2] },
      { type: LINEAR_RAMP_TO_VALUE_AT_TIME, time: 0.3, args: [1.0, 0.3] },
      { type: LINEAR_RAMP_TO_VALUE_AT_TIME, time: 0.325, args: [0.8, 0.325] },
      { type: SET_TARGET_AT_TIME, time: 0.325, args: [0.5, 0.325, 0.1] },
      { type: SET_VALUE_AT_TIME, time: 0.5, args: [0.5521321830351336, 0.5] },
      { type: EXPONENTIAL_RAMP_TO_VALUE_AT_TIME, time: 0.6, args: [0.75, 0.6] },
      { type: EXPONENTIAL_RAMP_TO_VALUE_AT_TIME, time: 0.7, args: [0.05, 0.7] },
      { type: SET_VALUE_CURVE_AT_TIME, time: 0.7, args: [curve, 0.7, 0.3] },
    ];

    expect(AudioParamUtils.computeValueAtTime(timeline, 0.0, 0)).toBe(0.2);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.05, 0)).toBe(0.2);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.1, 0)).toBe(0.3);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.15, 0)).toBe(0.3);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.2, 0)).toBe(0.4);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.25, 0)).toBe(0.7);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.3, 0)).toBe(1.0);
    expect(AudioParamUtils.computeValueAtTime(timeline, 0.325, 0)).toBe(0.8);
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.35, 0),
        0.7336,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.4, 0),
        0.6417,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.45, 0),
        0.5859,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.5, 0),
        0.5521,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.55, 0),
        0.6435,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(AudioParamUtils.computeValueAtTime(timeline, 0.6, 0), 0.75, 1e-4),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.65, 0),
        0.1936,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(AudioParamUtils.computeValueAtTime(timeline, 0.7, 0), 0.0, 1e-4),
    ).toBeTruthy();
    expect(
      closeTo(AudioParamUtils.computeValueAtTime(timeline, 0.75, 0), 0.5, 1e-4),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.8, 0),
        0.866,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(AudioParamUtils.computeValueAtTime(timeline, 0.85, 0), 1.0, 1e-4),
    ).toBeTruthy();
    expect(
      closeTo(
        AudioParamUtils.computeValueAtTime(timeline, 0.9, 0),
        0.866,
        1e-4,
      ),
    ).toBeTruthy();
    expect(
      closeTo(AudioParamUtils.computeValueAtTime(timeline, 0.95, 0), 0.5, 1e-4),
    ).toBeTruthy();
    expect(
      closeTo(AudioParamUtils.computeValueAtTime(timeline, 1.0, 0), 0.0, 1e-4),
    ).toBeTruthy();
  });
});
