'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var events = _interopDefault(require('events'));
var assert = _interopDefault(require('assert'));
var fft = _interopDefault(require('fourier-transform'));
var BiquadCoeffs = _interopDefault(require('biquad-coeffs-webaudio'));
var audioType = _interopDefault(require('audio-type'));
var WavDecoder = _interopDefault(require('wav-decoder'));
var WavEncoder = _interopDefault(require('wav-encoder'));

function nmap(n, map) {
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = map(i, i, result);
    }
    return result;
}

/**
 * @param {*} data
 * @return {boolean}
 */
function isAudioData(data) {
  if (!data) {
    return false;
  }
  if (!Number.isFinite(data.sampleRate)) {
    return false;
  }
  if (!Array.isArray(data.channelData)) {
    return false;
  }
  if (!data.channelData.every((data) => data instanceof Float32Array)) {
    return false;
  }
  return true;
}

/**
 * @param {object} data
 * @return {AudioData}
 */
function toAudioData(data) {
  if (isAudioData(data)) {
    const numberOfChannels = data.channelData.length;
    const length = numberOfChannels ? data.channelData[0].length : 0;
    const sampleRate = data.sampleRate;
    const channelData = data.channelData;

    return { numberOfChannels, length, sampleRate, channelData };
  }
  if (isAudioBuffer(data)) {
    const numberOfChannels = data.numberOfChannels;
    const sampleRate = data.sampleRate;
    const channelData = nmap(numberOfChannels, (_, ch) =>
      data.getChannelData(ch),
    );
    const length = numberOfChannels ? channelData[0].length : 0;

    return { numberOfChannels, length, sampleRate, channelData };
  }
  return { numberOfChannels: 0, length: 0, sampleRate: 0, channelData: [] };
}

/**
 * @param {*} data
 * @return {boolean}
 */
function isAudioBuffer(data) {
  if (!data) {
    return false;
  }
  if (typeof data.numberOfChannels !== 'number') {
    return false;
  }
  if (typeof data.sampleRate !== 'number') {
    return false;
  }
  if (typeof data.getChannelData !== 'function') {
    return false;
  }
  return true;
}

/**
 * @param {object} data
 * @param {class}  AudioBuffer
 * @return {AudioBuffer}
 */
function toAudioBuffer(data, AudioBuffer) {
  data = toAudioData(data);

  const audioBuffer = new AudioBuffer({
    numberOfChannels: data.numberOfChannels,
    length: data.length,
    sampleRate: data.sampleRate,
  });
  const audioData = (audioBuffer._impl || audioBuffer).audioData;

  audioData.numberOfChannels = data.numberOfChannels;
  audioData.length = data.length;
  audioData.sampleRate = data.sampleRate;
  audioData.channelData = data.channelData;

  return audioBuffer;
}

class EventTarget {
  constructor() {
    this._emitter = new events.EventEmitter();
  }

  /**
   * @param {string}   type
   * @param {function} listener
   */
  addEventListener(type, listener) {
    /* istanbul ignore else */
    if (typeof listener === 'function') {
      this._emitter.addListener(type, listener);
    }
  }

  /**
   * @param {string}   type
   * @param {function} listener
   */
  removeEventListener(type, listener) {
    /* istanbul ignore else */
    if (typeof listener === 'function') {
      this._emitter.removeListener(type, listener);
    }
  }

  /**
   * @param {string}   type
   * @param {function} oldListener
   * @param {function} newListener
   */
  replaceEventListener(type, oldListener, newListener) {
    this.removeEventListener(type, oldListener);
    this.addEventListener(type, newListener);
  }

  /**
   * @param {object} event
   * @param {string} event.type
   */
  dispatchEvent(event) {
    this._emitter.emit(event.type, event);
  }
}

/**
 * AudioData is struct like AudioBuffer.
 * This instance has no methods.
 * The channel data of this instance are taken via property accessor.
 * @prop {number}         numberOfChannels
 * @prop {number}         length
 * @prop {number}         sampleRate
 * @prop {Float32Array[]} channelData
 */
class AudioData {
  /**
   * @param {number} numberOfChannels
   * @param {number} length
   * @param {number} sampleRate
   * @param {Float32Array[]} [channelData]
   */
  constructor(numberOfChannels, length, sampleRate, channelData) {
    this.numberOfChannels = numberOfChannels | 0;
    this.length = length | 0;
    this.sampleRate = sampleRate | 0;
    this.channelData =
      channelData ||
      nmap(this.numberOfChannels, () => new Float32Array(this.length));
  }
}

/**
 * @param {number} value
 * @param {number} minValue
 * @param {number} maxValue
 */
function clamp(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(value, maxValue));
}

/**
 * @param {*} value
 * @param {*) defaultValue
 */
function defaults(value, defaultValue) {
  return typeof value !== 'undefined' ? value : defaultValue;
}

/**
 * @param {object} target
 * @param {string} name
 * @param {*}      value
 */
function defineProp(target, name, value) {
  Object.defineProperty(target, name, {
    value: value,
    enumerable: false,
    writable: true,
    configurable: true,
  });
}

/**
 * @param {number[]} list
 * @param {number}   value
 * @return {number[]}
 */
function fill(list, value) {
  if (list.fill) {
    return list.fill(value);
  }

  for (let i = 0, imax = list.length; i < imax; i++) {
    list[i] = value;
  }

  return list;
}

/**
 * @param {number[]} list
 * @param {number}   value
 * @param {number}   start
 * @param {number}   end
 * @return {number[]}
 */
function fillRange(list, value, start, end) {
  if (list.fill) {
    return list.fill(value, start, end);
  }

  for (let i = start; i < end; i++) {
    list[i] = value;
  }

  return list;
}

/**
 * normalize - returns a number between 0 - 1
 * @param {number} value
 * @param {number} minValue
 * @param {number} maxValue
 */
function normalize(value, minValue, maxValue) {
  const val = (value - minValue) / (maxValue - minValue);
  return clamp(val, 0, 1);
}

/**
 * @param {number|string} str
 * @return {number}
 */
function toAudioTime(str) {
  if (Number.isFinite(+str)) {
    return Math.max(0, +str);
  }

  const matched = ('' + str).match(/^(?:(\d\d+):)?(\d\d?):(\d\d?(?:\.\d+)?)$/);

  if (matched) {
    const hours = +matched[1] | 0;
    const minutes = +matched[2];
    const seconds = +matched[3];

    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
}

/**
 * @param {*} value
 * @return {number}
 */
function toDecibel(value) {
  return 20 * Math.log10(value);
}

/**
 * @param {*} decibels
 * @return {number}
 */
function toLinear(decibels) {
  return Math.pow(10, 0.05 * decibels);
}

/**
 * @param {number} f
 * @returns {number}
 */
function flushDenormalFloatToZero(f) {
  return Math.abs(f) < 1.175494e-38 ? 0.0 : f;
}

/**
 * @param {object} value
 * @return {object}
 */
function toImpl(value) {
  return value._impl || value;
}

/**
 * @param {*} value
 * @return {number}
 */
function toNumber(value) {
  return +value || 0;
}

/**
 * @param {number}   value
 * @param {function} round
 * @return {number}
 */
function toPowerOfTwo(value, round) {
  round = round || Math.round;
  return 1 << round(Math.log(value) / Math.log(2));
}

/**
 * @param {number} value
 * @return {number}
 */
function toValidBitDepth(value) {
  value = value | 0;
  if (value === 8 || value === 16 || value === 32) {
    return value;
  }
  return 16;
}

const MIN_SAMPLERATE = 3000;
const MAX_SAMPLERATE = 192000;
const MIN_NUMBER_OF_CHANNELS = 1;
const MAX_NUMBER_OF_CHANNELS = 32;
const MIN_BLOCK_SIZE = 8;
const MAX_BLOCK_SIZE = 1024;

/**
 * @param {number} value
 * @return {number}
 */
function toValidBlockSize(value) {
  return clamp(toPowerOfTwo(value), MIN_BLOCK_SIZE, MAX_BLOCK_SIZE);
}

/**
 * @param {number} value
 * @return {number}
 */
function toValidNumberOfChannels(value) {
  return clamp(toNumber(value), 1, MAX_NUMBER_OF_CHANNELS) | 0;
}

/**
 * @param {number} value
 * @return {number}
 */
function toValidSampleRate(value) {
  return clamp(toNumber(value), MIN_SAMPLERATE, MAX_SAMPLERATE) | 0;
}

const SPEAKERS = 'speakers';
const DISCRETE = 'discrete';

const DSPAlgorithm = {};

/**
 * @prop {AudioData} audioData
 * @prop {boolean}   isSilent
 */
class AudioBus {
  /**
   * @param {number} numberOfChannels
   * @param {number} length
   * @param {number} sampleRate
   */
  constructor(numberOfChannels, length, sampleRate) {
    this.audioData = new AudioData(numberOfChannels, length, sampleRate);
    this.isSilent = true;
    this.channelInterpretation = DISCRETE;
  }

  /**
   * @return {string} [ SPEAKERS, DISCRETE ]
   */
  getChannelInterpretation() {
    return this.channelInterpretation;
  }

  /**
   * @param {string} value - [ SPEAKERS, DISCRETE ]
   */
  setChannelInterpretation(value) {
    this.channelInterpretation = value;
  }

  /**
   * @return {number}
   */
  getNumberOfChannels() {
    return this.audioData.numberOfChannels;
  }

  /**
   * @param {number} numberOfChannels
   */
  setNumberOfChannels(numberOfChannels) {
    const audioBus = new AudioBus(
      numberOfChannels,
      this.getLength(),
      this.getSampleRate(),
    );

    audioBus.channelInterpretation = this.channelInterpretation;
    audioBus.sumFrom(this);

    this.audioData = audioBus.audioData;
  }

  /**
   * @return {number}
   */
  getLength() {
    return this.audioData.length;
  }

  /**
   * @return {number}
   */
  getSampleRate() {
    return this.audioData.sampleRate;
  }

  /**
   * @return {Float32Array[]}
   */
  getChannelData() {
    return this.audioData.channelData;
  }

  /**
   * @return {Float32Array[]}
   */
  getMutableData() {
    this.isSilent = false;
    return this.audioData.channelData;
  }

  /**
   *
   */
  zeros() {
    /* istanbul ignore else */
    if (!this.isSilent) {
      const channelData = this.audioData.channelData;

      for (let i = 0, imax = channelData.length; i < imax; i++) {
        fill(channelData[i], 0);
      }
    }
    this.isSilent = true;
  }

  /**
   * @param {AudioBus} audioBus
   */
  copyFrom(audioBus) {
    const source = audioBus.audioData.channelData;
    const destination = this.audioData.channelData;
    const numberOfChannels = destination.length;

    assert(audioBus instanceof AudioBus);
    assert(
      audioBus.audioData.numberOfChannels === this.audioData.numberOfChannels,
    );
    assert(audioBus.audioData.length === this.audioData.length);

    for (let ch = 0; ch < numberOfChannels; ch++) {
      destination[ch].set(source[ch]);
    }

    this.isSilent = audioBus.isSilent;
  }

  /**
   * @param {AudioBus} audioBus
   * @param {number}   offset
   */
  copyFromWithOffset(audioBus, offset) {
    const source = audioBus.audioData.channelData;
    const destination = this.audioData.channelData;
    const numberOfChannels = destination.length;

    assert(audioBus instanceof AudioBus);
    assert(
      audioBus.audioData.numberOfChannels === this.audioData.numberOfChannels,
    );

    offset = offset | 0;

    for (let ch = 0; ch < numberOfChannels; ch++) {
      destination[ch].set(source[ch], offset);
    }

    this.isSilent = this.isSilent && audioBus.isSilent;
  }

  /**
   * @param {AudioBus} audioBus
   */
  sumFrom(audioBus) {
    assert(audioBus instanceof AudioBus);

    /* istanbul ignore next */
    if (audioBus.isSilent) {
      return;
    }

    const source = audioBus.audioData.channelData;
    const destination = this.audioData.channelData;

    this._sumFrom(source, destination, audioBus.getLength());
  }

  /**
   * @param {AudioBus} audioBus
   * @param {number}   offset
   */
  sumFromWithOffset(audioBus, offset) {
    assert(audioBus instanceof AudioBus);

    /* istanbul ignore next */
    if (audioBus.isSilent) {
      return;
    }

    offset = offset | 0;

    const source = audioBus.audioData.channelData;
    const destination = this.audioData.channelData.map((data) =>
      data.subarray(offset),
    );

    this._sumFrom(source, destination, audioBus.getLength());
  }

  /**
   * @private
   */
  _sumFrom(source, destination, length) {
    let mixFunction;
    let algoIndex = source.length * 1000 + destination.length;

    if (this.channelInterpretation === DISCRETE) {
      algoIndex += 2000000;
    } else {
      algoIndex += 1000000;
    }

    mixFunction = DSPAlgorithm[algoIndex] || DSPAlgorithm[0];

    if (this.isSilent && mixFunction.set) {
      mixFunction = mixFunction.set;
    }

    mixFunction(source, destination, length);

    this.isSilent = false;
  }
}

DSPAlgorithm[0] = (source, destination, length) => {
  const numberOfChannels = Math.min(source.length, destination.length);

  for (let ch = 0; ch < numberOfChannels; ch++) {
    for (let i = 0; i < length; i++) {
      destination[ch][i] += source[ch][i];
    }
  }
};
DSPAlgorithm[0].set = (source, destination) => {
  const numberOfChannels = Math.min(source.length, destination.length);

  for (let ch = 0; ch < numberOfChannels; ch++) {
    destination[ch].set(source[ch]);
  }
};

DSPAlgorithm[1001001] = (source, destination, length) => {
  const output = destination[0];
  const input = source[0];

  for (let i = 0; i < length; i++) {
    output[i] += input[i];
  }
};
DSPAlgorithm[1001001].set = (source, destination) => {
  destination[0].set(source[0]);
};
DSPAlgorithm[2001001] = DSPAlgorithm[1001001];
DSPAlgorithm[2001001].set = DSPAlgorithm[1001001].set;

DSPAlgorithm[1001002] = (source, destination, length) => {
  const outputL = destination[0];
  const outputR = destination[1];
  const input = source[0];

  for (let i = 0; i < length; i++) {
    outputL[i] += input[i];
    outputR[i] += input[i];
  }
};
DSPAlgorithm[1001002].set = (source, destination) => {
  destination[0].set(source[0]);
  destination[1].set(source[0]);
};

DSPAlgorithm[1001004] = DSPAlgorithm[1001002];
DSPAlgorithm[1001004].set = DSPAlgorithm[1001002].set;

DSPAlgorithm[1001006] = (source, destination, length) => {
  const outputC = destination[2];
  const input = source[0];

  for (let i = 0; i < length; i++) {
    outputC[i] += input[i];
  }
};
DSPAlgorithm[1001006].set = (source, destination) => {
  destination[2].set(source[0]);
};

DSPAlgorithm[1002002] = (source, destination, length) => {
  const outputL = destination[0];
  const outputR = destination[1];
  const inputL = source[0];
  const inputR = source[1];

  for (let i = 0; i < length; i++) {
    outputL[i] += inputL[i];
    outputR[i] += inputR[i];
  }
};
DSPAlgorithm[1002002].set = (source, destination) => {
  destination[0].set(source[0]);
  destination[1].set(source[1]);
};
DSPAlgorithm[2002002] = DSPAlgorithm[1002002];
DSPAlgorithm[2002002].set = DSPAlgorithm[1002002].set;

DSPAlgorithm[1002004] = DSPAlgorithm[1002002];
DSPAlgorithm[1002004].set = DSPAlgorithm[1002002].set;

DSPAlgorithm[1002006] = DSPAlgorithm[1002004];
DSPAlgorithm[1002006].set = DSPAlgorithm[1002004].set;

DSPAlgorithm[1004006] = (source, destination, length) => {
  const outputL = destination[0];
  const outputR = destination[1];
  const outputSL = destination[4];
  const outputSR = destination[5];
  const inputL = source[0];
  const inputR = source[1];
  const inputSL = source[2];
  const inputSR = source[3];

  for (let i = 0; i < length; i++) {
    outputL[i] += inputL[i];
    outputR[i] += inputR[i];
    outputSL[i] += inputSL[i];
    outputSR[i] += inputSR[i];
  }
};
DSPAlgorithm[1004006].set = (source, destination) => {
  destination[0].set(source[0]);
  destination[1].set(source[1]);
  destination[4].set(source[2]);
  destination[5].set(source[3]);
};

DSPAlgorithm[1002001] = (source, destination, length) => {
  const output = destination[0];
  const inputL = source[0];
  const inputR = source[1];

  for (let i = 0; i < length; i++) {
    output[i] += 0.5 * (inputL[i] + inputR[i]);
  }
};

DSPAlgorithm[1004001] = (source, destination, length) => {
  const output = destination[0];
  const inputL = source[0];
  const inputR = source[1];
  const inputSL = source[2];
  const inputSR = source[3];

  for (let i = 0; i < length; i++) {
    output[i] += 0.25 * (inputL[i] + inputR[i] + inputSL[i] + inputSR[i]);
  }
};

DSPAlgorithm[1006001] = (source, destination, length) => {
  const output = destination[0];
  const inputL = source[0];
  const inputR = source[1];
  const inputC = source[2];
  const inputSL = source[4];
  const inputSR = source[5];

  for (let i = 0; i < length; i++) {
    output[i] +=
      0.7071 * (inputL[i] + inputR[i]) +
      inputC[i] +
      0.5 * (inputSL[i] + inputSR[i]);
  }
};

DSPAlgorithm[1004002] = (source, destination, length) => {
  const outputL = destination[0];
  const outputR = destination[1];
  const inputL = source[0];
  const inputR = source[1];
  const inputSL = source[2];
  const inputSR = source[3];

  for (let i = 0; i < length; i++) {
    outputL[i] += 0.5 * (inputL[i] + inputSL[i]);
    outputR[i] += 0.5 * (inputR[i] + inputSR[i]);
  }
};

DSPAlgorithm[1006002] = (source, destination, length) => {
  const outputL = destination[0];
  const outputR = destination[1];
  const inputL = source[0];
  const inputR = source[1];
  const inputC = source[2];
  const inputSL = source[4];
  const inputSR = source[5];

  for (let i = 0; i < length; i++) {
    outputL[i] += inputL[i] + 0.7071 * (inputC[i] + inputSL[i]);
    outputR[i] += inputR[i] + 0.7071 * (inputC[i] + inputSR[i]);
  }
};

DSPAlgorithm[1006004] = (source, destination, length) => {
  const outputL = destination[0];
  const outputR = destination[1];
  const outputSL = destination[2];
  const outputSR = destination[3];
  const inputL = source[0];
  const inputR = source[1];
  const inputC = source[2];
  const inputSL = source[4];
  const inputSR = source[5];

  for (let i = 0; i < length; i++) {
    outputL[i] += inputL[i] + 0.7071 * inputC[i];
    outputR[i] += inputR[i] + 0.7071 * inputC[i];
    outputSL[i] += inputSL[i];
    outputSR[i] += inputSR[i];
  }
};

const MAX = 'max';
const CLAMPED_MAX = 'clamped-max';
const EXPLICIT = 'explicit';

/**
 * @prop {AudioNode} node
 * @prop {number}    index
 * @prop {AudioBus}  bus
 */
class AudioNodeInput {
  /**
   * @param {object}    opts
   * @param {AudioNode} opts.node
   * @param {number}    opts.index
   * @param {number}    opts.numberOfChannels
   * @param {number}    opts.channelCount
   * @param {string}    opts.channelCountMode
   */
  constructor(opts) {
    const node = opts.node;
    const index = opts.index;
    const numberOfChannels = opts.numberOfChannels;
    const channelCount = opts.channelCount;
    const channelCountMode = opts.channelCountMode;

    this.node = node;
    this.index = index | 0;
    this.bus = new AudioBus(numberOfChannels, node.blockSize, node.sampleRate);

    this.bus.setChannelInterpretation(SPEAKERS);
    this.outputs = [];
    this._disabledOutputs = new WeakSet();
    this._channelCount = channelCount | 0;
    this._channelCountMode = channelCountMode;
  }

  /**
   * @return {number}
   */
  getChannelCount() {
    return this._channelCount;
  }

  /**
   * @param {number} value
   */
  setChannelCount(value) {
    const channelCount = toValidNumberOfChannels(value);

    /* istanbul ignore else */
    if (channelCount !== this._channelCount) {
      this._channelCount = channelCount;
      this.updateNumberOfChannels();
    }
  }

  /**
   * @return {number}
   */
  getChannelCountMode() {
    return this._channelCountMode;
  }

  /**
   * @param {number} value
   */
  setChannelCountMode(value) {
    /* istanbul ignore else */
    if (value !== this._channelCountMode) {
      this._channelCountMode = value;
      this.updateNumberOfChannels();
    }
  }

  /**
   * @return {string}
   */
  getChannelInterpretation() {
    return this.bus.getChannelInterpretation();
  }

  /**
   * @param {string} value
   */
  setChannelInterpretation(value) {
    this.bus.setChannelInterpretation(value);
  }

  /**
   * @return {number}
   */
  getNumberOfChannels() {
    return this.bus.getNumberOfChannels();
  }

  /**
   *
   */
  computeNumberOfChannels() {
    if (this._channelCountMode === EXPLICIT) {
      return this._channelCount;
    }

    const maxChannels = this.outputs.reduce((maxChannels, output) => {
      return Math.max(maxChannels, output.getNumberOfChannels());
    }, 1);

    if (this._channelCountMode === CLAMPED_MAX) {
      return Math.min(this._channelCount, maxChannels);
    }

    return maxChannels;
  }

  /**
   *
   */
  updateNumberOfChannels() {
    const numberOfChannels = this.computeNumberOfChannels();

    /* istanbul ignore else */
    if (numberOfChannels !== this.bus.getNumberOfChannels()) {
      this.bus.setNumberOfChannels(numberOfChannels);
      this.node.channelDidUpdate(numberOfChannels);
    }
  }

  /**
   * @return {boolean}
   */
  isEnabled() {
    return this.outputs.length !== 0;
  }

  /**
   * @param {AudioNodeOutput} output
   */
  enableFrom(output) {
    /* istanbul ignore else */
    if (moveItem(output, this._disabledOutputs, this.outputs)) {
      this.inputDidUpdate();
    }
  }

  /**
   * @param {AudioNodeOutput} output
   */
  disableFrom(output) {
    /* istanbul ignore else */
    if (moveItem(output, this.outputs, this._disabledOutputs)) {
      this.inputDidUpdate();
    }
  }

  /**
   * @param {AudioNodeOutput} output
   */
  connectFrom(output) {
    if (output.isEnabled()) {
      assert(!this._disabledOutputs.has(output));
      /* istanbul ignore else */
      if (addItem(output, this.outputs)) {
        this.inputDidUpdate();
      }
    } else {
      assert(this.outputs.indexOf(output) === -1);
      addItem(output, this._disabledOutputs);
    }
  }

  /**
   * @param {AudioNodeOutput} output
   */
  disconnectFrom(output) {
    if (output.isEnabled()) {
      assert(!this._disabledOutputs.has(output));
      /* istanbul ignore else */
      if (removeItem(output, this.outputs)) {
        this.inputDidUpdate();
      }
    } else {
      assert(this.outputs.indexOf(output) === -1);
      removeItem(output, this._disabledOutputs);
    }
  }

  /**
   *
   */
  inputDidUpdate() {
    this.updateNumberOfChannels();
    if (this.outputs.length === 0) {
      this.node.disableOutputsIfNecessary();
    } else {
      this.node.enableOutputsIfNecessary();
    }
  }

  /**
   * @return {boolean}
   */
  isConnectedFrom(node) {
    return (
      this.outputs.some((target) => target.node === node) ||
      !!(
        node &&
        Array.isArray(node.outputs) &&
        node.outputs.some((target) => this._disabledOutputs.has(target))
      )
    );
  }

  /**
   * @return {AudioBus}
   */
  sumAllConnections() {
    const audioBus = this.bus;
    const outputs = this.outputs;

    audioBus.zeros();

    for (let i = 0, imax = outputs.length; i < imax; i++) {
      audioBus.sumFrom(outputs[i].pull());
    }

    return audioBus;
  }

  /**
   * @return {AudioBus}
   */
  pull() {
    if (this.outputs.length === 1) {
      const output = this.outputs[0];

      /* istanbul ignore else */
      if (output.getNumberOfChannels() === this.getNumberOfChannels()) {
        return this.bus.copyFrom(output.pull());
      }
    }

    return this.sumAllConnections();
  }
}

function addItem(target, destination) {
  if (destination instanceof WeakSet) {
    /* istanbul ignore next */
    if (destination.has(target)) {
      return false;
    }
    destination.add(target);
  } else {
    const index = destination.indexOf(target);

    /* istanbul ignore next */
    if (index !== -1) {
      return false;
    }
    destination.push(target);
  }
  return true;
}

function removeItem(target, source) {
  if (source instanceof WeakSet) {
    /* istanbul ignore next */
    if (!source.has(target)) {
      return false;
    }
    source.delete(target);
  } else {
    const index = source.indexOf(target);

    /* istanbul ignore next */
    if (index === -1) {
      return false;
    }
    source.splice(index, 1);
  }
  return true;
}

function moveItem(target, source, destination) {
  return removeItem(target, source) && addItem(target, destination);
}

/**
 * @prop {AudioNode} node
 * @prop {number}    index
 * @prop {AudioBus}  bus
 */
class AudioNodeOutput {
  /**
   * @param {object} opts
   * @param {AudioNode} opts.node
   * @param {number}    opts.index
   * @param {number}    opts.numberOfChannels
   * @param {boolean}   opts.enabled
   */
  constructor(opts) {
    const node = opts.node;
    const index = opts.index;
    const numberOfChannels = opts.numberOfChannels;
    const enabled = opts.enabled;

    this.node = node;
    this.index = index | 0;
    this.bus = new AudioBus(numberOfChannels, node.blockSize, node.sampleRate);
    this.inputs = [];
    this._enabled = !!enabled;
  }

  /**
   * @return {number}
   */
  getNumberOfChannels() {
    return this.bus.getNumberOfChannels();
  }

  /**
   * @param {number} numberOfChannels
   */
  setNumberOfChannels(numberOfChannels) {
    /* istanbul ignore else */
    if (numberOfChannels !== this.getNumberOfChannels()) {
      const channelInterpretation = this.node.getChannelInterpretation();

      this.bus.setNumberOfChannels(numberOfChannels, channelInterpretation);

      this.inputs.forEach((input) => {
        input.updateNumberOfChannels();
      });
    }
  }

  /**
   * @return {boolean}
   */
  isEnabled() {
    return this._enabled;
  }

  /**
   *
   */
  enable() {
    /* istanbul ignore else */
    if (!this._enabled) {
      this._enabled = true;
      this.inputs.forEach((input) => {
        input.enableFrom(this);
      });
    }
  }

  /**
   *
   */
  disable() {
    /* istanbul ignore else */
    if (this._enabled) {
      this._enabled = false;
      this.inputs.forEach((input) => {
        input.disableFrom(this);
      });
    }
  }

  /**
   *
   */
  zeros() {
    this.bus.zeros();
  }

  /**
   * @param {AudioNode|AudioParam} destination
   * @param {number}               index
   */
  connect(destination, input) {
    const target = destination.inputs[input | 0];

    if (this.inputs.indexOf(target) === -1) {
      this.inputs.push(target);
      target.connectFrom(this);
    }
  }

  /**
   *
   */
  disconnect(...args) {
    const isTargetToDisconnect =
      args.length === 1
        ? (target) => target.node === args[0] || target.node === args[0]._impl
        : args.length === 2
        ? (target) =>
            (target.node === args[0] || target.node === args[0]._impl) &&
            target.index === args[1]
        : () => true;

    for (let i = this.inputs.length - 1; i >= 0; i--) {
      const target = this.inputs[i];

      if (isTargetToDisconnect(target)) {
        target.disconnectFrom(this);
        this.inputs.splice(i, 1);
      }
    }
  }

  /**
   * @return {boolean}
   */
  isConnectedTo(node) {
    return this.inputs.some((target) => target.node === node);
  }

  /**
   * @return {AudioBus}
   */
  pull() {
    this.node.processIfNecessary();
    return this.bus;
  }
}

const SET_VALUE_AT_TIME = 'setValueAtTime';
const LINEAR_RAMP_TO_VALUE_AT_TIME = 'linearRampToValueAtTime';
const EXPONENTIAL_RAMP_TO_VALUE_AT_TIME = 'exponentialRampToValueAtTime';
const SET_TARGET_AT_TIME = 'setTargetAtTime';
const SET_VALUE_CURVE_AT_TIME = 'setValueCurveAtTime';

/**
 * @param {object[]} timeline
 * @param {number}   time
 * @param {number}   defaultValue
 */
function computeValueAtTime(timeline, time, defaultValue) {
  let value = defaultValue;

  for (let i = 0, imax = timeline.length; i < imax; i++) {
    const e0 = timeline[i];
    const e1 = timeline[i + 1];
    const t0 = Math.min(time, e1 ? e1.time : time);

    if (time < e0.time) {
      break;
    }

    switch (e0.type) {
      case SET_VALUE_AT_TIME:
      case LINEAR_RAMP_TO_VALUE_AT_TIME:
      case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
        value = e0.args[0];
        break;
      case SET_TARGET_AT_TIME:
        value = getTargetValueAtTime(
          t0,
          value,
          e0.args[0],
          e0.args[1],
          e0.args[2],
        );
        break;
      case SET_VALUE_CURVE_AT_TIME:
        value = getValueCurveAtTime(t0, e0.args[0], e0.args[1], e0.args[2]);
        break;
    }
    if (e1) {
      switch (e1.type) {
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
          value = getLinearRampToValueAtTime(
            t0,
            value,
            e1.args[0],
            e0.time,
            e1.args[1],
          );
          break;
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          value = getExponentialRampToValueAtTime(
            t0,
            value,
            e1.args[0],
            e0.time,
            e1.args[1],
          );
          break;
      }
    }
  }

  return value;
}

function getLinearRampToValueAtTime(t, v0, v1, t0, t1) {
  let a;

  if (t <= t0) {
    return v0;
  }
  if (t1 <= t) {
    return v1;
  }

  a = (t - t0) / (t1 - t0);

  return v0 + a * (v1 - v0);
}

function getExponentialRampToValueAtTime(t, v0, v1, t0, t1) {
  let a;

  if (t <= t0) {
    return v0;
  }
  if (t1 <= t) {
    return v1;
  }

  a = (t - t0) / (t1 - t0);

  return v0 * Math.pow(v1 / v0, a);
}

function getTargetValueAtTime(t, v0, v1, t0, timeConstant) {
  if (t <= t0) {
    return v0;
  }
  return v1 + (v0 - v1) * Math.exp((t0 - t) / timeConstant);
}

function getValueCurveAtTime(t, curve, t0, duration) {
  let x, ix, i0, i1;
  let y0, y1, a;

  x = (t - t0) / duration;
  ix = x * (curve.length - 1);
  i0 = ix | 0;
  i1 = i0 + 1;

  if (curve.length <= i1) {
    return curve[curve.length - 1];
  }

  y0 = curve[i0];
  y1 = curve[i1];
  a = ix % 1;

  return y0 + a * (y1 - y0);
}

const AudioParamDSP = {
  dspInit() {
    this._prevValue = NaN;
    this._hasSampleAccurateValues = false;
    this._currentEventIndex = -1;
    this._quantumStartFrame = -1;
    this._remainSamples = 0;
    this._schedParams = {};
  },

  dspProcess() {
    const input = this.inputs[0];
    const inputBus = input.bus;

    input.pull();

    const hasEvents = !!this._timeline.length;
    const hasInput = !inputBus.isSilent;
    const algorithm = hasEvents * 2 + hasInput;

    switch (algorithm) {
      case 0:
        // events: x / input: x
        return this.dspStaticValue();
      case 1:
        // events: x / input: o
        return this.dspInputAndOffset(inputBus);
      case 2:
        // events: o / input: x
        return this.dspEvents();
      case 3:
        // events: o / input: o
        return this.dspEventsAndInput(inputBus);
      default:
        /* istanbul ignore next */
        assert(!'NOT REACHED');
    }
  },

  dspStaticValue() {
    const value = this._value;

    if (value !== this._prevValue) {
      if (value === 0) {
        this.outputBus.zeros();
      } else {
        fill(this.outputBus.getMutableData()[0], value);
      }
      this._prevValue = value;
    }

    this._hasSampleAccurateValues = false;
  },

  dspInputAndOffset(inputBus) {
    const blockSize = this.blockSize;
    const outputBus = this.outputBus;
    const output = outputBus.getMutableData()[0];
    const input = inputBus.getChannelData()[0];
    const value = this._value;

    output.set(input);

    if (value !== 0) {
      for (let i = 0; i < blockSize; i++) {
        output[i] += value;
      }
    }

    this._prevValue = NaN;
    this._hasSampleAccurateValues = true;
  },

  dspEvents() {
    const outputBus = this.outputBus;
    const output = outputBus.getMutableData()[0];

    this.dspValuesForTimeRange(output);

    this._prevValue = NaN;
    this._hasSampleAccurateValues = true;
  },

  dspEventsAndInput(inputBus) {
    const blockSize = this.blockSize;
    const outputBus = this.outputBus;
    const output = outputBus.getMutableData()[0];
    const input = inputBus.getChannelData()[0];

    this.dspValuesForTimeRange(output);

    for (let i = 0; i < blockSize; i++) {
      output[i] += input[i];
    }

    this._prevValue = NaN;
    this._hasSampleAccurateValues = true;
  },

  dspValuesForTimeRange(output) {
    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const sampleRate = this.sampleRate;
    const timeline = this._timeline;

    let value = this._value;
    let writeIndex = 0;

    // processing until the first event
    if (this._currentEventIndex === -1) {
      const firstEventStartFrame = timeline[0].startFrame;

      // timeline
      // |----------------|----------------|-------*--------|----------------|
      // ^                ^                        ^
      // |                quantumEndFrame          firstEventStartFrame
      // quantumStartFrame
      // <---------------> fill value with in range
      if (quantumEndFrame <= firstEventStartFrame) {
        for (let i = 0; i < blockSize; i++) {
          output[i] = value;
        }
        this._hasSampleAccurateValues = false;
        return;
      }

      // timeline
      // |----------------|----------------|-------*--------|----------------|
      //                                   ^       ^        ^
      //                                   |       |        quantumEndFrame
      //                                   |       firstEventStartFrame
      //                                   quantumStartFrame
      //                                   <------> fill value with in range
      for (
        let i = 0, imax = firstEventStartFrame - quantumStartFrame;
        i < imax;
        i++
      ) {
        output[writeIndex++] = value;
      }
      this._currentEventIndex = 0;
    }

    this._hasSampleAccurateValues = true;

    let remainSamples =
      this._quantumStartFrame === quantumStartFrame ? this._remainSamples : 0;
    let schedParams = this._schedParams;

    // if new event exists, should recalculate remainSamples
    if (
      remainSamples === Infinity &&
      this._currentEventIndex + 1 !== timeline.length
    ) {
      remainSamples =
        timeline[this._currentEventIndex + 1].startFrame - quantumStartFrame;
    }

    while (
      writeIndex < blockSize &&
      this._currentEventIndex < timeline.length
    ) {
      const eventItem = timeline[this._currentEventIndex];
      const startFrame = eventItem.startFrame;
      const endFrame = eventItem.endFrame;

      // timeline
      // |-------*--------|-------*--------|----------------|----------------|
      //         ^                ^        ^                ^
      //         |<-------------->|        |                quantumEndFrame
      //         |                |        quantumStartFrame
      //         startFrame       endFrame
      // skip event if
      // (endFrame < quantumStartFrame): past event
      //  or
      // (startFrame === endFrame): setValueAtTime before linearRampToValueAtTime or exponentialRampToValueAtTime.
      if (endFrame < quantumStartFrame || startFrame === endFrame) {
        remainSamples = 0;
        this._currentEventIndex += 1;
        continue;
      }

      if (remainSamples <= 0) {
        const processedSamples = Math.max(0, quantumStartFrame - startFrame);

        switch (eventItem.type) {
          case SET_VALUE_AT_TIME:
            {
              value = eventItem.startValue;
              schedParams = { type: SET_VALUE_AT_TIME };
            }
            break;
          case LINEAR_RAMP_TO_VALUE_AT_TIME:
            {
              const valueRange = eventItem.endValue - eventItem.startValue;
              const frameRange = eventItem.endFrame - eventItem.startFrame;
              const grow = valueRange / frameRange;

              if (grow) {
                value = eventItem.startValue + processedSamples * grow;
                schedParams = { type: LINEAR_RAMP_TO_VALUE_AT_TIME, grow };
              } else {
                value = eventItem.startValue;
                schedParams = { type: SET_VALUE_AT_TIME };
              }
            }
            break;
          case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
            {
              const valueRatio = eventItem.endValue / eventItem.startValue;
              const frameRange = eventItem.endFrame - eventItem.startFrame;
              const grow = Math.pow(valueRatio, 1 / frameRange);

              if (grow) {
                value = eventItem.startValue * Math.pow(grow, processedSamples);
                schedParams = { type: EXPONENTIAL_RAMP_TO_VALUE_AT_TIME, grow };
              } else {
                value = eventItem.startValue;
                schedParams = { type: SET_VALUE_AT_TIME };
              }
            }
            break;
          case SET_TARGET_AT_TIME:
            {
              const target = Math.fround(eventItem.args[0]);
              const timeConstant = eventItem.args[2];
              const discreteTimeConstant =
                1 - Math.exp(-1 / (sampleRate * timeConstant));
              const time = (quantumStartFrame + writeIndex) / sampleRate;

              value = computeValueAtTime(
                timeline,
                time,
                this._userValue,
              );

              if (discreteTimeConstant !== 1) {
                schedParams = {
                  type: SET_TARGET_AT_TIME,
                  target,
                  discreteTimeConstant,
                };
              } else {
                schedParams = { type: SET_VALUE_AT_TIME };
              }
            }
            break;
          case SET_VALUE_CURVE_AT_TIME:
            {
              const curve = eventItem.args[0];

              schedParams = {
                type: SET_VALUE_CURVE_AT_TIME,
                curve,
                startFrame,
                endFrame,
              };
            }
            break;
        }

        remainSamples = endFrame - startFrame - processedSamples;
      } // if (remainSamples === 0)

      const fillFrames = Math.min(blockSize - writeIndex, remainSamples);

      switch (schedParams.type) {
        case SET_VALUE_AT_TIME:
          {
            for (let i = 0; i < fillFrames; i++) {
              output[writeIndex++] = value;
            }
          }
          break;
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
          {
            for (let i = 0; i < fillFrames; i++) {
              output[writeIndex++] = value;
              value += schedParams.grow;
            }
          }
          break;
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          {
            for (let i = 0; i < fillFrames; i++) {
              output[writeIndex++] = value;
              value *= schedParams.grow;
            }
          }
          break;
        case SET_TARGET_AT_TIME:
          {
            for (let i = 0; i < fillFrames; i++) {
              output[writeIndex++] = value;
              value +=
                (schedParams.target - value) * schedParams.discreteTimeConstant;
            }
          }
          break;
        case SET_VALUE_CURVE_AT_TIME:
          {
            const curve = schedParams.curve;
            const schedRange = schedParams.endFrame - schedParams.startFrame;
            const schedStartFrame = schedParams.startFrame;

            for (let i = 0; i < fillFrames; i++) {
              const xx =
                (quantumStartFrame + writeIndex - schedStartFrame) / schedRange;
              const ix = xx * (curve.length - 1);
              const i0 = ix | 0;
              const i1 = i0 + 1;

              value = curve[i0] + (ix % 1) * (curve[i1] - curve[i0]);
              output[writeIndex++] = value;
            }

            if (remainSamples === fillFrames) {
              value = curve[curve.length - 1];
            }
          }
          break;
      }

      remainSamples -= fillFrames;

      if (remainSamples === 0) {
        this._currentEventIndex += 1;
      }
    } // while (writeIndex < blockSize)

    while (writeIndex < blockSize) {
      output[writeIndex++] = value;
    }

    this._value = value;
    this._schedParams = schedParams;
    this._remainSamples = remainSamples;
    this._quantumStartFrame = quantumEndFrame;
  },
};

const CONTROL_RATE = 'control';
const AUDIO_RATE = 'audio';

/**
 * @prop {AudioContext}      context
 * @prop {number}            blockSize
 * @prop {number}            sampleRate
 * @prop {AudioNodeInput[]}  inputs
 * @prop {AudioBus}          outputBus
 */
class AudioParam {
  /**
   * @param {AudioContext} context
   * @param {string}       opts.rate - [ AUDIO_RATE, CONTROL_RATE ]
   * @param {number}       opts.defaultValue
   */
  constructor(context, opts = {}) {
    const rate = defaults(opts.rate, CONTROL_RATE);
    const defaultValue = defaults(opts.defaultValue, 0);

    this.context = context;
    this.blockSize = context.blockSize;
    this.sampleRate = context.sampleRate;
    this.inputs = [
      new AudioNodeInput({
        node: this,
        index: 0,
        numberOfChannels: 1,
        channelCount: 1,
        channelCountMode: EXPLICIT,
      }),
    ];
    this.outputBus = new AudioBus(1, this.blockSize, this.sampleRate);

    this._rate = rate;
    this._defaultValue = toNumber(defaultValue);
    this._value = this._defaultValue;
    this._userValue = this._value;
    this._timeline = [];

    this.dspInit(this._rate);
  }

  /**
   * @return {number}
   */
  getValue() {
    return this._value;
  }

  /**
   * @param {number} value
   */
  setValue(value) {
    this._value = this._userValue = toNumber(value);
  }

  /**
   * @return {number}
   */
  getDefaultValue() {
    return this._defaultValue;
  }

  /**
   * @param {number} value
   * @param {number} startTime
   */
  setValueAtTime(value, startTime) {
    value = toNumber(value);
    startTime = Math.max(0, toNumber(startTime));

    const eventItem = {
      type: SET_VALUE_AT_TIME,
      time: startTime,
      args: [value, startTime],
      startFrame: Math.round(startTime * this.sampleRate),
      endFrame: Infinity,
      startValue: value,
      endValue: value,
    };
    const index = this.insertEvent(eventItem);
    const prevEventItem = this._timeline[index - 1];
    const nextEventItem = this._timeline[index + 1];

    if (prevEventItem) {
      switch (prevEventItem.type) {
        case SET_VALUE_AT_TIME:
        case SET_TARGET_AT_TIME:
          prevEventItem.endFrame = eventItem.startFrame;
          break;
      }
    }

    if (nextEventItem) {
      switch (nextEventItem.type) {
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          nextEventItem.startFrame = eventItem.startFrame;
          nextEventItem.startValue = eventItem.startValue;
          break;
      }
      eventItem.endFrame = nextEventItem.startFrame;
    }

    if (index <= this._currentEventIndex) {
      this._currentEventIndex = index;
      this._remainSamples = 0;
    }
  }

  /**
   * @param {number} value
   * @param {number} endTime
   */
  linearRampToValueAtTime(value, endTime) {
    value = toNumber(value);
    endTime = Math.max(0, toNumber(endTime));

    const eventItem = {
      type: LINEAR_RAMP_TO_VALUE_AT_TIME,
      time: endTime,
      args: [value, endTime],
      startFrame: 0,
      endFrame: Math.round(endTime * this.sampleRate),
      startValue: this._defaultValue,
      endValue: value,
    };
    const index = this.insertEvent(eventItem);
    const prevEventItem = this._timeline[index - 1];
    const nextEventItem = this._timeline[index + 1];

    if (prevEventItem) {
      switch (prevEventItem.type) {
        case SET_VALUE_AT_TIME:
        case SET_TARGET_AT_TIME:
          eventItem.startFrame = prevEventItem.startFrame;
          eventItem.startValue = prevEventItem.startValue;
          prevEventItem.endFrame = eventItem.startFrame;
          break;
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
        case SET_VALUE_CURVE_AT_TIME:
          eventItem.startFrame = prevEventItem.endFrame;
          eventItem.startValue = prevEventItem.endValue;
          break;
      }
    }

    if (nextEventItem) {
      switch (nextEventItem.type) {
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          nextEventItem.startFrame = eventItem.endFrame;
          nextEventItem.startValue = eventItem.endValue;
          break;
      }
    }

    if (index <= this._currentEventIndex) {
      this._currentEventIndex = index;
      this._remainSamples = 0;
    }
  }

  /**
   * @param {number} value
   * @param {number} endTime
   */
  exponentialRampToValueAtTime(value, endTime) {
    value = Math.max(1e-6, toNumber(value));
    endTime = Math.max(0, toNumber(endTime));

    const eventItem = {
      type: EXPONENTIAL_RAMP_TO_VALUE_AT_TIME,
      time: endTime,
      args: [value, endTime],
      startFrame: 0,
      endFrame: Math.round(endTime * this.sampleRate),
      startValue: Math.max(1e-6, this._defaultValue),
      endValue: value,
    };
    const index = this.insertEvent(eventItem);
    const prevEventItem = this._timeline[index - 1];
    const nextEventItem = this._timeline[index + 1];

    if (prevEventItem) {
      switch (prevEventItem.type) {
        case SET_VALUE_AT_TIME:
        case SET_TARGET_AT_TIME:
          eventItem.startFrame = prevEventItem.startFrame;
          eventItem.startValue = prevEventItem.startValue;
          prevEventItem.endFrame = eventItem.startFrame;
          break;
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
        case SET_VALUE_CURVE_AT_TIME:
          eventItem.startFrame = prevEventItem.endFrame;
          eventItem.startValue = prevEventItem.endValue;
          break;
      }
    }

    if (nextEventItem) {
      switch (nextEventItem.type) {
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          nextEventItem.startFrame = eventItem.endFrame;
          nextEventItem.startValue = eventItem.endValue;
          break;
      }
    }

    if (index <= this._currentEventIndex) {
      this._currentEventIndex = index;
      this._remainSamples = 0;
    }
  }

  /**
   * @param {number} target
   * @param {number} startTime
   * @param {number} timeConstant
   */
  setTargetAtTime(target, startTime, timeConstant) {
    target = toNumber(target);
    startTime = Math.max(0, toNumber(startTime));
    timeConstant = Math.max(0, toNumber(timeConstant));

    const eventItem = {
      type: SET_TARGET_AT_TIME,
      time: startTime,
      args: [target, startTime, timeConstant],
      startFrame: Math.round(startTime * this.sampleRate),
      endFrame: Infinity,
      startValue: 0,
      endValue: target,
    };
    const index = this.insertEvent(eventItem);
    const prevEventItem = this._timeline[index - 1];
    const nextEventItem = this._timeline[index + 1];

    if (prevEventItem) {
      switch (prevEventItem.type) {
        case SET_VALUE_AT_TIME:
          eventItem.startValue = prevEventItem.endValue;
          prevEventItem.endFrame = eventItem.startFrame;
          break;
        case SET_TARGET_AT_TIME:
          eventItem.startValue = 0;
          prevEventItem.endFrame = eventItem.startFrame;
          break;
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
        case SET_VALUE_CURVE_AT_TIME:
          eventItem.startValue = prevEventItem.endValue;
          break;
      }
    }

    if (nextEventItem) {
      switch (nextEventItem.type) {
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          nextEventItem.startFrame = eventItem.startFrame;
          nextEventItem.startValue = eventItem.startValue;
          break;
      }
      eventItem.endFrame = nextEventItem.startFrame;
    }

    if (index <= this._currentEventIndex) {
      this._currentEventIndex = index;
      this._remainSamples = 0;
    }
  }

  /**
   * @param {Float32Array[]} values
   * @param {number}         startTime
   * @param {number}         duration
   */
  setValueCurveAtTime(values, startTime, duration) {
    startTime = Math.max(0, toNumber(startTime));
    duration = Math.max(0, toNumber(duration));

    if (values.length === 0 || duration === 0) {
      return;
    }

    const eventItem = {
      type: SET_VALUE_CURVE_AT_TIME,
      time: startTime,
      args: [values, startTime, duration],
      startFrame: Math.round(startTime * this.sampleRate),
      endFrame: Math.round((startTime + duration) * this.sampleRate),
      startValue: values[0],
      endValue: values[values.length - 1],
    };
    const index = this.insertEvent(eventItem);
    const prevEventItem = this._timeline[index - 1];
    const nextEventItem = this._timeline[index + 1];

    if (prevEventItem) {
      switch (prevEventItem.type) {
        case SET_VALUE_AT_TIME:
        case SET_TARGET_AT_TIME:
          prevEventItem.endFrame = eventItem.startFrame;
          break;
      }
    }

    if (nextEventItem) {
      switch (nextEventItem.type) {
        case LINEAR_RAMP_TO_VALUE_AT_TIME:
        case EXPONENTIAL_RAMP_TO_VALUE_AT_TIME:
          nextEventItem.startFrame = eventItem.startFrame;
          nextEventItem.startValue = eventItem.endValue;
          break;
      }
    }

    if (index <= this._currentEventIndex) {
      this._currentEventIndex = index;
      this._remainSamples = 0;
    }
  }

  /**
   * @param {number} startTime
   */
  cancelScheduledValues(startTime) {
    startTime = Math.max(0, toNumber(startTime));

    this._timeline = this._timeline.filter(
      (eventItem) => eventItem.time < startTime,
    );

    const index = this._timeline.length - 1;
    const lastEventItem = this._timeline[index];

    if (lastEventItem) {
      switch (lastEventItem.type) {
        case SET_VALUE_AT_TIME:
        case SET_TARGET_AT_TIME:
          lastEventItem.endFrame = Infinity;
          break;
      }
    }

    if (index <= this._currentEventIndex) {
      this._currentEventIndex = index;
      this._remainSamples = 0;
    }
  }

  /**
   * @return {string}
   */
  getRate() {
    return this._rate;
  }

  /**
   * @return {boolean}
   */
  hasSampleAccurateValues() {
    return this._hasSampleAccurateValues;
  }

  /**
   * @return {Float32Array}
   */
  getSampleAccurateValues() {
    return this.outputBus.getChannelData()[0];
  }

  /**
   *
   */
  enableOutputsIfNecessary() {}

  /**
   *
   */
  disableOutputsIfNecessary() {}

  /**
   * @return {object[]}
   */
  getTimeline() {
    return this._timeline;
  }

  /**
   * @return {object[]}
   */
  getEvents() {
    return this._timeline.map((event) => {
      return { type: event.type, time: event.time, args: event.args };
    });
  }

  /**
   * @param {object}
   * @return {number}
   */
  insertEvent(eventItem) {
    const time = eventItem.time;
    const timeline = this._timeline;

    if (timeline.length === 0 || timeline[timeline.length - 1].time < time) {
      timeline.push(eventItem);
      return timeline.length - 1;
    }

    let pos = 0;
    let replace = 0;

    while (pos < timeline.length) {
      if (
        timeline[pos].time === time &&
        timeline[pos].type === eventItem.type
      ) {
        replace = 1;
        break;
      }
      if (time < timeline[pos].time) {
        break;
      }
      pos += 1;
    }

    timeline.splice(pos, replace, eventItem);

    return pos;
  }
}

Object.assign(AudioParam.prototype, AudioParamDSP);

/**
 * @prop {AudioContext}      context
 * @prop {number}            blockSize
 * @prop {number}            sampleRate
 * @prop {AudioNodeInput[]}  inputs
 * @prop {AudioNodeOutput[]} outputs
 */
class AudioNode extends EventTarget {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.channelCount
   * @param {string}       opts.channelCountMode
   * @param {string}       opts.channelInterpretation
   * @param {number[]}     config.inputs
   * @param {number[]}     config.outputs
   * @param {number}       config.channelCount
   * @param {string}       config.channelCountMode
   */
  constructor(context, opts = {}, config = {}) {
    const inputs = defaults(config.inputs, []);
    const outputs = defaults(config.outputs, []);
    const channelCount = defaults(config.channelCount, 1);
    const channelCountMode = defaults(config.channelCountMode, MAX);
    const channelInterpretation = SPEAKERS;
    const allowedMinChannelCount = defaults(
      config.allowedMinChannelCount,
      MIN_NUMBER_OF_CHANNELS,
    );
    const allowedMaxChannelCount = defaults(
      config.allowedMaxChannelCount,
      MAX_NUMBER_OF_CHANNELS,
    );
    const allowedChannelCountMode = defaults(config.allowedChannelCountMode, [
      MAX,
      CLAMPED_MAX,
      EXPLICIT,
    ]);
    const allowedChannelInterpretation = defaults(
      config.allowedChannelInterpretation,
      [DISCRETE, SPEAKERS],
    );

    super();

    this.context = context;
    this.blockSize = context.blockSize;
    this.sampleRate = context.sampleRate;
    this.inputs = [];
    this.outputs = [];
    this.channelCount = channelCount;
    this.channelCountMode = channelCountMode;
    this.channelInterpretation = channelInterpretation;
    this.allowedMinChannelCount = allowedMinChannelCount;
    this.allowedMaxChannelCount = allowedMaxChannelCount;
    this.allowedChannelCountMode = allowedChannelCountMode;
    this.allowedChannelInterpretation = allowedChannelInterpretation;
    this.currentSampleFrame = -1;

    this._params = [];
    this._enabled = false;
    this._disableAtSampleFrame = Infinity;

    inputs.forEach((numberOfChannels) => {
      this.addInput(numberOfChannels, channelCount, channelCountMode);
    });
    outputs.forEach((numberOfChannels) => {
      this.addOutput(numberOfChannels);
    });

    if (typeof opts.channelCount === 'number') {
      this.setChannelCount(opts.channelCount);
    }
    if (typeof opts.channelCountMode === 'string') {
      this.setChannelCountMode(opts.channelCountMode);
    }
    if (typeof opts.channelInterpretation === 'string') {
      this.setChannelInterpretation(opts.channelInterpretation);
    }
  }

  /**
   * @return {number}
   */
  getNumberOfInputs() {
    return this.inputs.length;
  }

  /**
   * @return {number}
   */
  getNumberOfOutputs() {
    return this.outputs.length;
  }

  /**
   * @return {number}
   */
  getChannelCount() {
    return this.channelCount;
  }

  /**
   * @param {number} value
   */
  setChannelCount(value) {
    value = toNumber(value);

    const channelCount = clamp(
      value,
      this.allowedMinChannelCount,
      this.allowedMaxChannelCount,
    );

    if (channelCount !== this.channelCount) {
      this.channelCount = channelCount;
      this.inputs.forEach((input) => {
        input.setChannelCount(value);
      });
    }
  }

  /**
   * @return {string}
   */
  getChannelCountMode() {
    return this.channelCountMode;
  }

  /**
   * @param {string} value
   */
  setChannelCountMode(value) {
    if (this.allowedChannelCountMode.indexOf(value) !== -1) {
      if (value !== this.channelCountMode) {
        this.channelCountMode = value;
        this.inputs.forEach((input) => {
          input.setChannelCountMode(value);
        });
      }
    }
  }

  /**
   * @return {string}
   */
  getChannelInterpretation() {
    return this.channelInterpretation;
  }

  /**
   * @param {string} value
   */
  setChannelInterpretation(value) {
    if (this.allowedChannelInterpretation.indexOf(value) !== -1) {
      if (value !== this.channelInterpretation) {
        this.channelInterpretation = value;
        this.inputs.forEach((input) => {
          input.setChannelInterpretation(value);
        });
      }
    }
  }

  /**
   * @param {AudioNode|AudioParam} destination
   * @param {number}               output
   * @param {number}               input
   */
  connect(destination, output, input) {
    this.outputs[output | 0].connect(destination, input | 0);
  }

  /**
   *
   */
  disconnect(...args) {
    if (args.length === 0) {
      return this.disconnectAll();
    }
    if (typeof args[0] === 'number') {
      return this.disconnectAllFromOutput(args[0] | 0);
    }
    if (args.length === 1) {
      return this.disconnectIfConnected(args[0]);
    }
    return this.disconnectFromOutputIfConnected(
      args[1] | 0,
      args[0],
      args[2] | 0,
    );
  }

  /**
   * @param {number} numberOfChannels
   * @param {number} channelCount
   * @param {string} channelCountMode
   * @return {AudioNodeInput}
   */
  addInput(numberOfChannels, channelCount, channelCountMode) {
    const node = this;
    const index = this.inputs.length;
    const input = new AudioNodeInput({
      node,
      index,
      numberOfChannels,
      channelCount,
      channelCountMode,
    });

    this.inputs.push(input);

    return input;
  }

  /**
   * @param {number} numberOfChannels
   * @return {AudioNodeOutput}
   */
  addOutput(numberOfChannels) {
    const node = this;
    const index = this.outputs.length;
    const output = new AudioNodeOutput({ node, index, numberOfChannels });

    this.outputs.push(output);

    return output;
  }

  /**
   * @param {string} rate - [ "audio", "control" ]
   * @param {number} defaultValue
   * @return {AudioParam}
   */
  addParam(rate, defaultValue) {
    const param = new AudioParam(this.context, { rate, defaultValue });

    this._params.push(param);

    return param;
  }

  /**
   * @return {boolean}
   */
  isEnabled() {
    return this._enabled;
  }

  /**
   * @return {number}
   */
  getTailTime() {
    return 0;
  }

  /**
   *
   */
  enableOutputsIfNecessary() {
    this._disableAtSampleFrame = Infinity;
    if (!this._enabled) {
      this._enabled = true;
      this.outputs.forEach((output) => {
        output.enable();
      });
    }
  }

  /**
   *
   */
  disableOutputsIfNecessary() {
    if (!this._enabled) {
      return;
    }
    const tailTime = this.getTailTime();
    if (tailTime === 0) {
      this._disableOutputsIfNecessary();
    } else if (tailTime !== Infinity) {
      const disableAtTime = this.context.currentTime + tailTime;
      this._disableAtSampleFrame = Math.round(disableAtTime * this.sampleRate);
    }
  }

  /**
   * @private
   */
  _disableOutputsIfNecessary() {
    if (this._enabled) {
      this._enabled = false;
      this.outputs.forEach((output) => {
        output.disable();
      });
    }
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    // do nothing
  }

  /**
   *
   */
  disconnectAll() {
    this.outputs.forEach((output) => {
      output.disconnect();
    });
  }

  /**
   * @param {number} output
   */
  disconnectAllFromOutput(output) {
    this.outputs[output | 0].disconnect();
  }

  /**
   * @param {AudioNode|AudioParam} destination
   */
  disconnectIfConnected(destination) {
    this.outputs.forEach((output) => {
      output.disconnect(destination);
    });
  }

  /**
   * @param {number} output
   * @param {AudioNode|AudioParam} destination
   * @param {number} output
   */
  disconnectFromOutputIfConnected(output, destination, input) {
    this.outputs[output | 0].disconnect(destination, input | 0);
  }

  /**
   *
   */
  processIfNecessary() {
    // prevent infinite loop when audio graph has feedback
    if (this.context.currentSampleFrame <= this.currentSampleFrame) {
      return;
    }
    this.currentSampleFrame = this.context.currentSampleFrame;

    if (this._disableAtSampleFrame <= this.currentSampleFrame) {
      const outputs = this.outputs;

      for (let i = 0, imax = outputs.length; i < imax; i++) {
        outputs[i].zeros();
      }

      this.context.addPostProcess(() => {
        this._disableOutputsIfNecessary();
      });
      return;
    }

    const inputs = this.inputs;

    for (let i = 0, imax = inputs.length; i < imax; i++) {
      inputs[i].pull();
    }

    const params = this._params;

    for (let i = 0, imax = params.length; i < imax; i++) {
      params[i].dspProcess();
    }

    this.dspProcess();
  }

  dspInit() {}

  dspProcess() {}
}

function blackman (i,N) {
  var a0 = 0.42,
      a1 = 0.5,
      a2 = 0.08,
      f = 6.283185307179586*i/(N-1);

  return a0 - a1 * Math.cos(f) + a2*Math.cos(2*f)
}

var blackman_1 = blackman;

const MAX_FFT_SIZE = 32768;

const AnalyserNodeDSP = {
  dspInit(sampleRate) {
    this._timeDomainBuffer = [];
    this._analyserBus = new AudioBus(1, MAX_FFT_SIZE, sampleRate);
    this._analyserBusOffset = 0;
    this._audioData = this._analyserBus.audioData.channelData[0];
  },
  dspUpdateSizes(fftSize) {
    const previousSmooth = new Float32Array(fftSize / 2);
    const blackmanTable = new Float32Array(fftSize);

    for (let i = 0; i < fftSize; i++) {
      blackmanTable[i] = blackman_1(i, fftSize);
    }

    this._previousSmooth = previousSmooth;
    this._blackmanTable = blackmanTable;
  },
  dspGetFloatFrequencyData(array) {
    const fftSize = this._fftSize;
    const blackmanTable = this._blackmanTable;
    const previousSmooth = this._previousSmooth;
    const waveform = new Float32Array(fftSize);
    const length = Math.min(array.length, fftSize / 2);
    const s = this._smoothingTimeConstant;

    // 1. down-mix
    this.dspGetFloatTimeDomainData(waveform);

    // 2. Apply Blackman window
    for (let i = 0; i < fftSize; i++) {
      waveform[i] = waveform[i] * blackmanTable[i] || 0;
    }

    // 3. FFT
    const spectrum = fft(waveform);

    // re-size to frequencyBinCount, then do more processing
    for (let i = 0; i < length; i++) {
      const v0 = spectrum[i];
      // 4. Smooth over data
      previousSmooth[i] = s * previousSmooth[i] + (1 - s) * v0;
      // 5. Convert to dB
      const v1 = toDecibel(previousSmooth[i]);
      // store in array
      array[i] = Number.isFinite(v1) ? v1 : 0;
    }
  },
  dspGetByteFrequencyData(array) {
    const length = Math.min(array.length, this._fftSize / 2);
    const dBMin = this._minDecibels;
    const dBMax = this._maxDecibels;
    const spectrum = new Float32Array(length);

    this.dspGetFloatFrequencyData(spectrum);

    for (let i = 0; i < length; i++) {
      array[i] = Math.round(normalize(spectrum[i], dBMin, dBMax) * 255);
    }
  },
  dspGetByteTimeDomainData(array) {
    const length = Math.min(array.length, this._fftSize);
    const waveform = new Float32Array(length);

    this.dspGetFloatTimeDomainData(waveform);

    for (let i = 0; i < length; i++) {
      array[i] = Math.round(normalize(waveform[i], -1, 1) * 255);
    }
  },
  dspGetFloatTimeDomainData(array) {
    const audioData = this._audioData;
    const fftSize = this._fftSize;
    const i0 =
      (this._analyserBusOffset - fftSize + MAX_FFT_SIZE) % MAX_FFT_SIZE;
    const i1 = Math.min(i0 + fftSize, MAX_FFT_SIZE);
    const copied = i1 - i0;

    array.set(audioData.subarray(i0, i1));

    if (copied !== fftSize) {
      const remain = fftSize - copied;
      const subarray2 = audioData.subarray(0, remain);

      array.set(subarray2, copied);
    }
  },
  dspProcess() {
    const inputBus = this.inputs[0].bus;
    const outputBus = this.outputs[0].bus;
    const analyserBus = this._analyserBus;
    const blockSize = inputBus.audioData.length;

    // just pass data through
    outputBus.copyFrom(inputBus);

    // merge and store data in our buffer
    analyserBus.copyFromWithOffset(inputBus, this._analyserBusOffset);

    this._analyserBusOffset += blockSize;
    if (MAX_FFT_SIZE <= this._analyserBusOffset) {
      this._analyserBusOffset = 0;
    }
  },
};

const DEFAULT_FFT_SIZE = 2048;
const DEFAULT_MIN_DECIBELS = -100;
const DEFAULT_MAX_DECIBELS = -30;
const DEFAULT_SMOOTHING_TIME_CONSTANT = 0.8;
const MIN_FFT_SIZE = 32;
const MAX_FFT_SIZE$1 = 32768;

class AnalyserNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.fftSize
   * @param {number}       opts.minDecibels
   * @param {number}       opts.maxDecibels
   * @param {number}       opts.smoothingTimeConstant
   */
  constructor(context, opts = {}) {
    const fftSize = defaults(opts.fftSize, DEFAULT_FFT_SIZE);
    const minDecibels = defaults(opts.minDecibels, DEFAULT_MIN_DECIBELS);
    const maxDecibels = defaults(opts.maxDecibels, DEFAULT_MAX_DECIBELS);
    const smoothingTimeConstant = defaults(
      opts.smoothingTimeConstant,
      DEFAULT_SMOOTHING_TIME_CONSTANT,
    );

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 1,
      channelCountMode: MAX,
    });

    this._fftSize = fftSize;
    this._minDecibels = minDecibels;
    this._maxDecibels = maxDecibels;
    this._smoothingTimeConstant = smoothingTimeConstant;

    this.dspInit(context.sampleRate);
    this.setFftSize(fftSize);
  }

  /**
   * @return {number}
   */
  getFftSize() {
    return this._fftSize;
  }

  /**
   * @param {number} value
   */
  setFftSize(value) {
    value = clamp(value | 0, MIN_FFT_SIZE, MAX_FFT_SIZE$1);
    value = toPowerOfTwo(value, Math.ceil);
    this._fftSize = value;
    this.dspUpdateSizes(this._fftSize);
  }

  /**
   * @return {number}
   */
  getFrequencyBinCount() {
    return this._fftSize / 2;
  }

  /**
   * @return {number}
   */
  getMinDecibels() {
    return this._minDecibels;
  }

  /**
   * @param {number} value
   */
  setMinDecibels(value) {
    value = toNumber(value);
    /* istanbul ignore else */
    if (-Infinity < value && value < this._maxDecibels) {
      this._minDecibels = value;
    }
  }

  /**
   * @return {number}
   */
  getMaxDecibels() {
    return this._maxDecibels;
  }

  /**
   * @param {number} value
   */
  setMaxDecibels(value) {
    value = toNumber(value);
    /* istanbul ignore else */
    if (this._minDecibels < value && value < Infinity) {
      this._maxDecibels = value;
    }
  }

  /**
   * @return {number}
   */
  getSmoothingTimeConstant() {
    return this._smoothingTimeConstant;
  }

  /**
   * @param {number}
   */
  setSmoothingTimeConstant(value) {
    value = clamp(toNumber(value), 0, 1);
    this._smoothingTimeConstant = value;
  }

  /**
   * @param {Float32Array} array
   */
  getFloatFrequencyData(array) {
    this.dspGetFloatFrequencyData(array);
  }

  /**
   * @param {Uint8Array} array
   */
  getByteFrequencyData(array) {
    this.dspGetByteFrequencyData(array);
  }

  /**
   * @param {Float32Array} array
   */
  getFloatTimeDomainData(array) {
    this.dspGetFloatTimeDomainData(array);
  }

  /**
   * @param {Uint8Array} array
   */
  getByteTimeDomainData(array) {
    this.dspGetByteTimeDomainData(array);
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }
}

Object.assign(AnalyserNode.prototype, AnalyserNodeDSP);

/**
 * @prop {AudioData} audioData
 */
class AudioBuffer {
  /**
   * @param {object}       opts
   * @param {number}       opts.numberOfChannels
   * @param {number}       opts.length
   * @param {number}       opts.sampleRate
   */
  constructor(opts = {}) {
    let numberOfChannels = opts.numberOfChannels;
    let length = opts.length;
    let sampleRate = opts.sampleRate;

    numberOfChannels = toValidNumberOfChannels(numberOfChannels);
    length = Math.max(0, toNumber(length));
    sampleRate = toValidSampleRate(sampleRate);

    this.audioData =
      opts instanceof AudioData
        ? opts
        : new AudioData(numberOfChannels, length, sampleRate);
  }

  /**
   * @return {number}
   */
  getSampleRate() {
    return this.audioData.sampleRate;
  }

  /**
   * @return {number}
   */
  getLength() {
    return this.audioData.length;
  }

  /**
   * @return {number}
   */
  getDuration() {
    return this.audioData.length / this.audioData.sampleRate;
  }

  /**
   * @return {number}
   */
  getNumberOfChannels() {
    return this.audioData.numberOfChannels;
  }

  /**
   * @return {Float32Array}
   */
  getChannelData(channel) {
    return this.audioData.channelData[channel | 0];
  }

  /**
   * @param {Float32Array} destination
   * @param {number}       channelNumber
   * @param {number}       startInChannel
   */
  copyFromChannel(destination, channelNumber, startInChannel) {
    const source = this.audioData.channelData[channelNumber | 0];

    startInChannel = startInChannel | 0;

    destination.set(
      source.subarray(startInChannel, startInChannel + destination.length),
    );
  }

  /**
   * @param {Float32Array} source
   * @param {number}       channelNumber
   * @param {number}       startInChannel
   */
  copyToChannel(source, channelNumber, startInChannel) {
    const destination = this.audioData.channelData[channelNumber | 0];

    startInChannel = startInChannel | 0;

    destination.set(source, startInChannel);
  }
}

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

const UNSCHEDULED = 'unscheduled';
const SCHEDULED = 'scheduled';
const PLAYING = 'playing';
const FINISHED = 'finished';

class AudioScheduledSourceNode extends AudioSourceNode {
  /**
   * @param {AudioContext} context
   */
  constructor(context, opts) {
    super(context, opts);

    this._startTime = Infinity;
    this._stopTime = Infinity;
    this._startFrame = Infinity;
    this._stopFrame = Infinity;
  }

  /**
   * @return {number}
   */
  getStartTime() {
    if (this._startTime !== Infinity) {
      return this._startTime;
    }
  }

  /**
   * @return {number}
   */
  getStopTime() {
    if (this._stopTime !== Infinity) {
      return this._stopTime;
    }
  }

  /**
   * @return {string}
   */
  getPlaybackState() {
    if (this._startTime === Infinity) {
      return UNSCHEDULED;
    }
    if (this.context.currentTime < this._startTime) {
      return SCHEDULED;
    }
    if (this._stopTime <= this.context.currentTime) {
      return FINISHED;
    }
    return PLAYING;
  }

  /**
   * @param {number} when
   * @param {number} [offset]
   * @param {number} [duration]
   */
  start(when, offset, duration) {
    /* istanbul ignore next */
    if (this._startTime !== Infinity) {
      return;
    }

    when = Math.max(this.context.currentTime, toNumber(when));

    this._startTime = when;
    this._startFrame = Math.round(when * this.sampleRate);

    this.context.sched(when, () => {
      this.outputs[0].enable();
    });
  }

  /**
   * @param {number} when
   */
  stop(when) {
    /* istanbul ignore next */
    if (this._stopTime !== Infinity) {
      return;
    }

    when = Math.max(this.context.currentTime, this._startTime, toNumber(when));

    this._stopTime = when;
    this._stopFrame = Math.round(when * this.sampleRate);
  }
}

const AudioBufferSourceNodeDSP = {
  dspInit() {
    this._phase = 0;
  },

  dspStart() {
    if (this._audioData) {
      const bufferSampleRate = this._audioData.sampleRate;
      const bufferDuration = this._audioData.length / bufferSampleRate;

      this._phase =
        Math.max(0, Math.min(this._offset, bufferDuration)) * bufferSampleRate;
    }
  },

  dspProcess() {
    if (this._audioData === null) {
      return this.dspEmitEnded();
    }

    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const sampleOffset = Math.max(0, this._startFrame - quantumStartFrame);
    const fillToSample =
      Math.min(quantumEndFrame, this._stopFrame) - quantumStartFrame;
    const outputs = this.outputs[0].bus.getMutableData();

    let writeIndex = 0;

    writeIndex = this.dspBufferRendering(
      outputs,
      sampleOffset,
      fillToSample,
      this.sampleRate,
    );

    // timeline
    // |----------------|-------*--------|----------------|----------------|
    //                  ^       ^        ^
    //                  |------>|        quantumEndFrame
    //                  | wrote |
    //                  |       stopFrame
    //                  quantumStartFrame
    if (this._stopFrame <= quantumStartFrame + writeIndex) {
      // rest samples fill zero
      const numberOfChannels = outputs.length;

      while (writeIndex < blockSize) {
        for (let ch = 0; ch < numberOfChannels; ch++) {
          outputs[ch][writeIndex] = 0;
        }
        writeIndex += 1;
      }

      this.dspEmitEnded();
    }
  },

  dspBufferRendering(outputs, writeIndex, inNumSamples, sampleRate) {
    const playbackRateValues = this._playbackRate.getSampleAccurateValues();
    const detuneValues = this._detune.getSampleAccurateValues();
    const numberOfChannels = this._audioData.numberOfChannels;
    const bufferLength = this._audioData.length;
    const bufferSampleRate = this._audioData.sampleRate;
    const bufferChannelData = this._audioData.channelData;
    const playbackRateToPhaseIncr = bufferSampleRate / sampleRate;

    let phase = this._phase;

    while (writeIndex < inNumSamples) {
      const playbackRateValue = playbackRateValues[writeIndex];
      const detuneValue = detuneValues[writeIndex];
      const computedPlaybackRate =
        playbackRateValue * Math.pow(2, detuneValue / 1200);

      for (let ch = 0; ch < numberOfChannels; ch++) {
        const v0 = bufferChannelData[ch][phase | 0] || 0;
        const v1 = bufferChannelData[ch][(phase | 0) + 1] || 0;

        outputs[ch][writeIndex] = v0 + (phase % 1) * (v1 - v0);
      }
      writeIndex += 1;

      phase += playbackRateToPhaseIncr * Math.max(0, computedPlaybackRate);

      if (this._loop) {
        if (0 <= this._loopStart && this._loopStart < this._loopEnd) {
          const loopEndSamples = this._loopEnd * bufferSampleRate;

          if (loopEndSamples <= phase) {
            phase = this._loopStart * bufferSampleRate;
          }
        } else {
          if (bufferLength <= phase) {
            phase = 0;
          }
        }
      } else {
        if (bufferLength <= phase) {
          this.dspEmitEnded();
          break;
        }
      }
    }

    this._phase = phase;

    return writeIndex;
  },

  dspEmitEnded() {
    this._done = true;
    this.context.addPostProcess(() => {
      this.outputs[0].bus.zeros();
      this.outputs[0].disable();
      this.dispatchEvent({ type: 'ended' });
    });
  },
};

const DEFAULT_PLAYBACK_RATE = 1;
const DEFAULT_DETUNE = 0;
const DEFAULT_LOOP = false;
const DEFAULT_LOOP_START = 0;
const DEFAULT_LOOP_END = 0;

class AudioBufferSourceNode extends AudioScheduledSourceNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.playbackRate
   * @param {number}       opts.detune
   * @param {boolean}      opts.loop
   * @param {number}       opts.loopStart
   * @param {number}       opts.loopEnd
   */
  constructor(context, opts = {}) {
    const playbackRate = defaults(opts.playbackRate, DEFAULT_PLAYBACK_RATE);
    const detune = defaults(opts.detune, DEFAULT_DETUNE);
    const loop = defaults(opts.loop, DEFAULT_LOOP);
    const loopStart = defaults(opts.loopStart, DEFAULT_LOOP_START);
    const loopEnd = defaults(opts.loopEnd, DEFAULT_LOOP_END);

    super(context, opts);

    this._buffer = null;
    this._audioData = null;
    this._playbackRate = this.addParam(CONTROL_RATE, playbackRate);
    this._detune = this.addParam(CONTROL_RATE, detune);
    this._loop = !!loop;
    this._loopStart = loopStart;
    this._loopEnd = loopEnd;
    this._offset = 0;
    this._duration = Infinity;
    this._done = false;
  }

  /**
   * @return {AudioBuffer}
   */
  getBuffer() {
    return this._buffer;
  }

  /**
   * @param {AudioBuffer} value
   */
  setBuffer(value) {
    value = toImpl(value);

    /* istanbul ignore else */
    if (value instanceof AudioBuffer) {
      this._buffer = value;
      this._audioData = this._buffer.audioData;
      this.outputs[0].setNumberOfChannels(this._audioData.numberOfChannels);
    }
  }

  /**
   * @return {number}
   */
  getStartOffset() {
    return this._offset;
  }

  /**
   * @return {number}
   */
  getStartDuration() {
    if (this._duration !== Infinity) {
      return this._duration;
    }
  }

  /**
   * @return {string}
   */
  getPlaybackState() {
    if (this._done) {
      return FINISHED;
    }
    return super.getPlaybackState();
  }

  /**
   * @return {AudioParam}
   */
  getPlaybackRate() {
    return this._playbackRate;
  }

  /**
   * @return {AudioParam}
   */
  getDetune() {
    return this._detune;
  }

  /**
   * @return {boolean}
   */
  getLoop() {
    return this._loop;
  }

  /**
   * @param {boolean}
   */
  setLoop(value) {
    this._loop = !!value;
  }

  /**
   * @return {number}
   */
  getLoopStart() {
    return this._loopStart;
  }

  /**
   * @param {number} value
   */
  setLoopStart(value) {
    value = Math.max(0, toNumber(value));
    this._loopStart = value;
  }

  /**
   * @return {number}
   */
  getLoopEnd() {
    return this._loopEnd;
  }

  /**
   * @param {number} value
   */
  setLoopEnd(value) {
    value = Math.max(0, toNumber(value));
    this._loopEnd = value;
  }

  /**
   * @param {number} when
   * @param {number} [offset]
   * @param {number} [duration]
   */
  start(when, offset, duration) {
    /* istanbul ignore next */
    if (this._startTime !== Infinity) {
      return;
    }

    offset = defaults(offset, 0);
    duration = defaults(duration, Infinity);

    when = Math.max(this.context.currentTime, toNumber(when));
    offset = Math.max(0, offset);
    duration = Math.max(0, toNumber(duration));

    this._startTime = when;
    this._startFrame = Math.round(when * this.sampleRate);
    this._offset = offset;

    if (duration !== Infinity) {
      this._duration = duration;
      this._stopFrame = Math.round(
        (this._startTime + duration) * this.sampleRate,
      );
    }

    this.context.sched(when, () => {
      this.dspStart();
      this.outputs[0].enable();
    });
  }
}

Object.assign(AudioBufferSourceNode.prototype, AudioBufferSourceNodeDSP);

var config = {
  sampleRate: 44100,
  numberOfChannels: 2,
  blockSize: 128,
  bitDepth: 16,
};

/**
 * @prop {AudioNodeOutput} output
 * @prop {AudioBus}        outputBus
 */
class AudioDestinationNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.numberOfChannels
   */
  constructor(context, opts = {}) {
    let numberOfChannels = opts.numberOfChannels;

    numberOfChannels = toValidNumberOfChannels(numberOfChannels);

    super(context, opts, {
      inputs: [numberOfChannels],
      outputs: [],
      channelCount: numberOfChannels,
      channelCountMode: EXPLICIT,
      allowedMaxChannelCount: numberOfChannels,
    });

    this._numberOfChannels = numberOfChannels | 0;
    this._destinationChannelData = this.inputs[0].bus.getChannelData();
  }

  /**
   * @return {number}
   */
  getMaxChannelCount() {
    return this._numberOfChannels;
  }

  /**
   * @param {Float32Array[]} channelData
   * @param {number}         offset
   */
  process(channelData, offset) {
    const inputs = this.inputs;
    const destinationChannelData = this._destinationChannelData;
    const numberOfChannels = channelData.length;

    for (let i = 0, imax = inputs.length; i < imax; i++) {
      inputs[i].pull();
    }

    for (let ch = 0; ch < numberOfChannels; ch++) {
      channelData[ch].set(destinationChannelData[ch], offset);
    }
  }
}

class AudioListener {
  /**
   * @param {AudioContext} context
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setPosition() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} xUp
   * @param {number} yUp
   * @param {number} zUp
   */
  /* istanbul ignore next */
  setOrientation() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }
}

const RUNNING = 'running';
const SUSPENDED = 'suspended';
const CLOSED = 'closed';

/**
 * @prop {number} sampleRate
 * @prop {number} blockSize
 * @prop {number} numberOfChannels
 * @prop {number} currentTime
 * @prop {number} currentSampleFrame
 */
class AudioContext extends EventTarget {
  /**
   * @param {object} opts
   * @param {number} opts.sampleRate
   * @param {number} opts.blockSize
   * @param {number} opts.numberOfChannels
   */
  constructor(opts = {}) {
    super();

    let sampleRate = defaults(opts.sampleRate, config.sampleRate);
    let blockSize = defaults(opts.blockSize, config.blockSize);
    let numberOfChannels = defaults(
      opts.channels || opts.numberOfChannels,
      config.numberOfChannels,
    );

    sampleRate = toValidSampleRate(sampleRate);
    blockSize = toValidBlockSize(blockSize);
    numberOfChannels = toValidNumberOfChannels(numberOfChannels);

    this.sampleRate = sampleRate | 0;
    this.blockSize = blockSize | 0;
    this.numberOfChannels = numberOfChannels | 0;
    this.currentTime = 0;
    this.currentSampleFrame = 0;
    this.state = SUSPENDED;
    this._destination = new AudioDestinationNode(this, { numberOfChannels });
    this._listener = new AudioListener(this);
    this._sched = {};
    this._callbacksForPostProcess = null;
    this._currentFrameIndex = 0;
  }

  /**
   * @return {AudioDestinationNode}
   */
  getDestination() {
    return this._destination;
  }

  /**
   * @return {number}
   */
  getSampleRate() {
    return this.sampleRate;
  }

  /**
   * @return {number}
   */
  getCurrentTime() {
    return this.currentTime;
  }

  /**
   * @return {AudioListener}
   */
  getListener() {
    return this._listener;
  }

  /**
   * @return {string}
   */
  getState() {
    return this.state;
  }

  /**
   * @return {Promise<void>}
   */
  suspend() {
    if (this.state === RUNNING) {
      return this.changeState(SUSPENDED);
    }
    return this.notChangeState();
  }

  /**
   * @return {Promise<void>}
   */
  resume() {
    if (this.state === SUSPENDED) {
      return this.changeState(RUNNING);
    }
    return this.notChangeState();
  }

  /**
   * @return {Promise<void>}
   */
  close() {
    if (this.state !== CLOSED) {
      return this.changeState(CLOSED);
    }
    return this.notChangeState();
  }

  /**
   * @param {string} state
   * @return {Promise<void>}
   */
  changeState(state) {
    this.state = state;
    return new Promise((resolve) => {
      this.dispatchEvent({ type: 'statechange' });
      resolve();
    });
  }

  /**
   * @return {Promise<void>}
   */
  notChangeState() {
    return Promise.resolve();
  }

  /**
   * @param {number}   time
   * @param {function} task
   */
  sched(time, task) {
    const schedSampleFrame =
      (Math.floor((time * this.sampleRate) / this.blockSize) * this.blockSize) |
      0;

    if (!this._sched[schedSampleFrame]) {
      this._sched[schedSampleFrame] = [task];
    } else {
      this._sched[schedSampleFrame].push(task);
    }
  }

  /**
   * @param {function} task
   */
  addPostProcess(task) {
    assert(typeof task === 'function');
    if (this._callbacksForPostProcess === null) {
      this._callbacksForPostProcess = [task];
    } else {
      this._callbacksForPostProcess.push(task);
    }
  }

  /**
   * @param {Float32Array[]} channelData
   * @param {number}         offset
   */
  process(channelData, offset) {
    const destination = this._destination;

    if (this.state !== RUNNING) {
      const numberOfChannels = channelData.length;
      const offsetEnd = offset + this.blockSize;

      for (let ch = 0; ch < numberOfChannels; ch++) {
        fillRange(channelData[ch], offset, offsetEnd);
      }
    } else {
      const sched = this._sched;
      const currentSampleFrame = this.currentSampleFrame | 0;

      if (sched[currentSampleFrame]) {
        const tasks = sched[currentSampleFrame];

        for (let i = 0, imax = tasks.length; i < imax; i++) {
          tasks[i]();
        }

        delete sched[currentSampleFrame];
      }

      destination.process(channelData, offset);

      if (this._callbacksForPostProcess !== null) {
        const tasks = this._callbacksForPostProcess;

        for (let i = 0, imax = tasks.length; i < imax; i++) {
          tasks[i]();
        }

        this._callbacksForPostProcess = null;
      }

      this.currentSampleFrame += this.blockSize;
      this.currentTime = this.currentSampleFrame / this.sampleRate;
    }
  }

  /**
   *
   */
  reset() {
    this.currentTime = 0;
    this.currentSampleFrame = 0;
    this.state = SUSPENDED;
    this._destination = new AudioDestinationNode(this, {
      numberOfChannels: this.numberOfChannels,
    });
    this._listener = new AudioListener(this);
    this._sched = [];
    this._callbacksForPostProcess = null;
  }
}

class BiquadFilterKernel {
  constructor(coefficients) {
    this.coefficients = coefficients;
    this._x1 = 0;
    this._x2 = 0;
    this._y1 = 0;
    this._y2 = 0;
  }

  process(input, output, inNumSamples) {
    const b0 = this.coefficients[0];
    const b1 = this.coefficients[1];
    const b2 = this.coefficients[2];
    const a1 = this.coefficients[3];
    const a2 = this.coefficients[4];

    let x0;
    let x1 = this._x1;
    let x2 = this._x2;
    let y0;
    let y1 = this._y1;
    let y2 = this._y2;

    for (let i = 0; i < inNumSamples; i++) {
      x0 = input[i];
      y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;

      x2 = x1;
      x1 = x0;
      y2 = y1;
      y1 = y0;

      output[i] = y0;
    }

    this._x1 = flushDenormalFloatToZero(x1);
    this._x2 = flushDenormalFloatToZero(x2);
    this._y1 = flushDenormalFloatToZero(y1);
    this._y2 = flushDenormalFloatToZero(y2);
  }

  processWithCoefficients(input, output, inNumSamples, coefficients) {
    let b0 = this.coefficients[0];
    let b1 = this.coefficients[1];
    let b2 = this.coefficients[2];
    let a1 = this.coefficients[3];
    let a2 = this.coefficients[4];
    let x0;
    let x1 = this._x1;
    let x2 = this._x2;
    let y0;
    let y1 = this._y1;
    let y2 = this._y2;

    const step = 1 / inNumSamples;
    const b0Incr = (coefficients[0] - b0) * step;
    const b1Incr = (coefficients[1] - b1) * step;
    const b2Incr = (coefficients[2] - b2) * step;
    const a1Incr = (coefficients[3] - a1) * step;
    const a2Incr = (coefficients[4] - a2) * step;

    for (let i = 0; i < inNumSamples; i++) {
      x0 = input[i];
      y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;

      x2 = x1;
      x1 = x0;
      y2 = y1;
      y1 = y0;

      b0 += b0Incr;
      b1 += b1Incr;
      b2 += b2Incr;
      a1 += a1Incr;
      a2 += a2Incr;

      output[i] = y0;
    }

    this._x1 = flushDenormalFloatToZero(x1);
    this._x2 = flushDenormalFloatToZero(x2);
    this._y1 = flushDenormalFloatToZero(y1);
    this._y2 = flushDenormalFloatToZero(y2);
    this.coefficients = coefficients;
  }
}

function getFilterResponse(
  b,
  a,
  frequencyHz,
  magResponse,
  phaseResponse,
  sampleRate,
) {
  for (let i = 0, imax = frequencyHz.length; i < imax; i++) {
    const w0 = 2 * Math.PI * (frequencyHz[i] / sampleRate);
    const ca = compute(a, Math.cos, w0);
    const sa = compute(a, Math.sin, w0);
    const cb = compute(b, Math.cos, w0);
    const sb = compute(b, Math.sin, w0);

    magResponse[i] = Math.sqrt((cb * cb + sb * sb) / (ca * ca + sa * sa));
    phaseResponse[i] = Math.atan2(sa, ca) - Math.atan2(sb, cb);
  }
}

function compute(values, fn, w0) {
  let result = 0;

  for (let i = 0, imax = values.length; i < imax; i++) {
    result += values[i] * fn(w0 * i);
  }

  return result;
}

const BiquadFilterNodeDSP = {
  dspInit() {
    this._kernels = [];
    this._quantumStartFrame = -1;
    this._coefficients = [0, 0, 0, 0, 0];
    this._prevFrequency = 0;
    this._prevDetune = 0;
    this._prevQ = 0;
    this._prevGain = 0;
  },

  dspUpdateKernel(numberOfChannels) {
    if (numberOfChannels < this._kernels.length) {
      this._kernels.splice(numberOfChannels);
    } else if (this._kernels.length < numberOfChannels) {
      while (numberOfChannels !== this._kernels.length) {
        this._kernels.push(new BiquadFilterKernel(this._coefficients));
      }
    }

    assert(numberOfChannels === this._kernels.length);

    switch (numberOfChannels) {
      case 1:
        this.dspProcess = this.dspProcess1;
        break;
      case 2:
        this.dspProcess = this.dspProcess2;
        break;
      default:
        this.dspProcess = this.dspProcessN;
        break;
    }
  },

  dspProcess1() {
    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const isCoefficientsUpdated = this.dspUpdateCoefficients();
    const coefficients = this._coefficients;
    const kernels = this._kernels;

    if (quantumStartFrame !== this._quantumStartFrame) {
      kernels[0].coefficients = coefficients;
      kernels[0].process(inputs[0], outputs[0], blockSize);
    } else if (isCoefficientsUpdated) {
      kernels[0].processWithCoefficients(
        inputs[0],
        outputs[0],
        blockSize,
        coefficients,
      );
    } else {
      kernels[0].process(inputs[0], outputs[0], blockSize);
    }

    this._quantumStartFrame = quantumEndFrame;
  },

  dspProcess2() {
    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const isCoefficientsUpdated = this.dspUpdateCoefficients();
    const coefficients = this._coefficients;
    const kernels = this._kernels;

    if (quantumStartFrame !== this._quantumStartFrame) {
      kernels[0].coefficients = coefficients;
      kernels[1].coefficients = coefficients;
      kernels[0].process(inputs[0], outputs[0], blockSize);
      kernels[1].process(inputs[1], outputs[1], blockSize);
    } else if (isCoefficientsUpdated) {
      kernels[0].processWithCoefficients(
        inputs[0],
        outputs[0],
        blockSize,
        coefficients,
      );
      kernels[1].processWithCoefficients(
        inputs[1],
        outputs[1],
        blockSize,
        coefficients,
      );
    } else {
      kernels[0].process(inputs[0], outputs[0], blockSize);
      kernels[1].process(inputs[1], outputs[1], blockSize);
    }

    this._quantumStartFrame = quantumEndFrame;
  },

  dspProcessN() {
    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const isCoefficientsUpdated = this.dspUpdateCoefficients();
    const coefficients = this._coefficients;
    const kernels = this._kernels;

    if (quantumStartFrame !== this._quantumStartFrame) {
      for (let i = 0, imax = kernels.length; i < imax; i++) {
        kernels[i].coefficients = coefficients;
        kernels[i].process(inputs[i], outputs[i], blockSize);
      }
    } else if (isCoefficientsUpdated) {
      for (let i = 0, imax = kernels.length; i < imax; i++) {
        kernels[i].processWithCoefficients(
          inputs[i],
          outputs[i],
          blockSize,
          coefficients,
        );
      }
    } else {
      for (let i = 0, imax = kernels.length; i < imax; i++) {
        kernels[i].process(inputs[i], outputs[i], blockSize);
      }
    }

    this._quantumStartFrame = quantumEndFrame;
  },

  dspUpdateCoefficients() {
    const frequency = this._frequency.getSampleAccurateValues()[0];
    const detune = this._detune.getSampleAccurateValues()[0];
    const Q = this._Q.getSampleAccurateValues()[0];
    const gain = this._gain.getSampleAccurateValues()[0];

    if (
      frequency === this._prevFrequency &&
      detune === this._prevDetune &&
      Q === this._prevQ &&
      gain === this._prevGain
    ) {
      return false;
    }

    const normalizedFrequency =
      (frequency / this.sampleRate) * Math.pow(2, detune / 1200);

    this._coefficients = BiquadCoeffs[this._type](normalizedFrequency, Q, gain);
    this._prevFrequency = frequency;
    this._prevDetune = detune;
    this._prevQ = Q;
    this._prevGain = gain;

    return true;
  },

  dspGetFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    const frequency = this._frequency.getValue();
    const detune = this._detune.getValue();
    const Q = this._Q.getValue();
    const gain = this._gain.getValue();
    const normalizedFrequency =
      (frequency / this.sampleRate) * Math.pow(2, detune / 1200);
    const coefficients = BiquadCoeffs[this._type](normalizedFrequency, Q, gain);

    const b = [coefficients[0], coefficients[1], coefficients[2]];
    const a = [1, coefficients[3], coefficients[4]];

    getFilterResponse(
      b,
      a,
      frequencyHz,
      magResponse,
      phaseResponse,
      this.sampleRate,
    );
  },
};

const LOWPASS = 'lowpass';
const HIGHPASS = 'highpass';
const BANDPASS = 'bandpass';
const LOWSHELF = 'lowshelf';
const HIGHSHELF = 'highshelf';
const PEAKING = 'peaking';
const NOTCH = 'notch';
const ALLPASS = 'allpass';

const allowedBiquadFilterTypes = [
  LOWPASS,
  HIGHPASS,
  BANDPASS,
  LOWSHELF,
  HIGHSHELF,
  PEAKING,
  NOTCH,
  ALLPASS,
];

const DEFAULT_TYPE = LOWPASS;
const DEFAULT_FREQUENCY = 350;
const DEFAULT_DETUNE$1 = 0;
const DEFAULT_Q = 1;
const DEFAULT_GAIN = 0;

class BiquadFilterNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {string}       opts.type
   * @param {number}       opts.frequency
   * @param {number}       opts.detune
   * @param {number}       opts.Q
   * @param {number}       opts.gain
   */
  constructor(context, opts = {}) {
    const type = defaults(opts.type, DEFAULT_TYPE);
    const frequency = defaults(opts.frequency, DEFAULT_FREQUENCY);
    const detune = defaults(opts.detune, DEFAULT_DETUNE$1);
    const Q = defaults(opts.Q, DEFAULT_Q);
    const gain = defaults(opts.gain, DEFAULT_GAIN);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._type = type;
    this._frequency = this.addParam(CONTROL_RATE, frequency);
    this._detune = this.addParam(CONTROL_RATE, detune);
    this._Q = this.addParam(CONTROL_RATE, Q);
    this._gain = this.addParam(CONTROL_RATE, gain);

    this.dspInit();
    this.dspUpdateKernel(1);
  }

  /**
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * @param {string} value
   */
  setType(value) {
    /* istanbul ignore else */
    if (allowedBiquadFilterTypes.indexOf(value) !== -1) {
      this._type = value;
    }
  }

  /**
   * @return {AudioParam}
   */
  getFrequency() {
    return this._frequency;
  }

  /**
   * @return {AudioParam}
   */
  getDetune() {
    return this._detune;
  }

  /**
   * @return {AudioParam}
   */
  getQ() {
    return this._Q;
  }

  /**
   * @return {AudioParam}
   */
  getGain() {
    return this._gain;
  }

  /**
   * @param {Float32Array} frequencyHz
   * @param {Float32Array} magResponse
   * @param {Float32Array} phaseResponse
   */
  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this.dspGetFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.dspUpdateKernel(numberOfChannels);
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }

  /**
   * @return {number}
   */
  getTailTime() {
    return 0.2;
  }
}

Object.assign(BiquadFilterNode.prototype, BiquadFilterNodeDSP);

const ChannelMergerNodeDSP = {
  dspProcess() {
    const outputBus = this.outputs[0].bus;
    const inputBuses = this.inputs.map((input) => input.bus);
    const allSilent = inputBuses.every((inputBus) => inputBus.isSilent);

    outputBus.zeros();

    if (!allSilent) {
      const outputChannelData = outputBus.getMutableData();

      for (let i = 0, imax = inputBuses.length; i < imax; i++) {
        outputChannelData[i].set(inputBuses[i].getChannelData()[0]);
      }
    }
  },
};

const DEFAULT_NUMBER_OF_INPUTS = 6;

class ChannelMergerNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.numberOfInputs
   */
  constructor(context, opts = {}) {
    let numberOfInputs = defaults(
      opts.numberOfInputs,
      DEFAULT_NUMBER_OF_INPUTS,
    );

    numberOfInputs = toValidNumberOfChannels(numberOfInputs);

    super(context, opts, {
      inputs: fill(new Array(numberOfInputs), 1),
      outputs: [numberOfInputs],
      channelCount: 1,
      channelCountMode: EXPLICIT,
      allowedMaxChannelCount: 1,
      allowedChannelCountMode: [EXPLICIT],
    });
  }

  disableOutputsIfNecessary() {
    // disable if all inputs are disabled

    /* istanbul ignore else */
    if (this.isEnabled()) {
      const inputs = this.inputs;

      for (let i = 0, imax = inputs.length; i < imax; i++) {
        if (inputs[i].isEnabled()) {
          return;
        }
      }

      super.disableOutputsIfNecessary();
    }
  }
}

Object.assign(ChannelMergerNode.prototype, ChannelMergerNodeDSP);

const ChannelSplitterNodeDSP = {
  dspProcess() {
    const inputBus = this.inputs[0].bus;
    const outputs = this.outputs;

    if (inputBus.isSilent) {
      for (let i = 0, imax = outputs.length; i < imax; i++) {
        outputs[i].bus.zeros();
      }
    } else {
      const inputChannelData = inputBus.getChannelData();

      for (let i = 0, imax = outputs.length; i < imax; i++) {
        const outputBus = outputs[i].bus;

        if (inputChannelData[i]) {
          outputBus.getMutableData()[0].set(inputChannelData[i]);
        } else {
          outputBus.zeros();
        }
      }
    }
  },
};

const DEFAULT_NUMBER_OF_OUTPUTS = 6;

class ChannelSplitterNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.numberOfOutputs
   */
  constructor(context, opts = {}) {
    let numberOfOutputs = defaults(
      opts.numberOfOutputs,
      DEFAULT_NUMBER_OF_OUTPUTS,
    );

    numberOfOutputs = toValidNumberOfChannels(numberOfOutputs);

    super(context, opts, {
      inputs: [1],
      outputs: fill(new Array(numberOfOutputs), 1),
      channelCount: 2,
      channelCountMode: MAX,
    });
  }
}

Object.assign(ChannelSplitterNode.prototype, ChannelSplitterNodeDSP);

const ConstantSourceNode = {
  dspInit() {},

  dspProcess() {
    const offsetParam = this._offset;
    const outputBus = this.outputs[0].bus;
    const outputs = outputBus.getMutableData();

    if (offsetParam.hasSampleAccurateValues()) {
      outputs[0].set(offsetParam.getSampleAccurateValues());
    } else {
      fill(outputs[0], offsetParam.getValue());
    }
  },
};

const DEFAULT_OFFSET = 1;

class ConstantSourceNode$1 extends AudioScheduledSourceNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.offset
   */
  constructor(context, opts = {}) {
    const offset = defaults(opts.offset, DEFAULT_OFFSET);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._offset = this.addParam(AUDIO_RATE, offset);
  }

  /**
   * @return {AudioParam}
   */
  getOffset() {
    return this._offset;
  }
}

Object.assign(ConstantSourceNode$1.prototype, ConstantSourceNode);

const ConvolverNodeDSP = {
  dspProcess() {
    const outputBus = this.outputs[0].bus;

    outputBus.zeros();
    outputBus.sumFrom(this.inputs[0].bus);
  },
};

const DEFAULT_DISABLE_NORMALIZATION = false;

class ConvolverNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {boolean}      opts.disableNormalization
   */
  constructor(context, opts = {}) {
    const disableNormalization = defaults(
      opts.disableNormalization,
      DEFAULT_DISABLE_NORMALIZATION,
    );

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: CLAMPED_MAX,
      allowedMaxChannelCount: 2,
      allowedChannelCountMode: [CLAMPED_MAX, EXPLICIT],
    });

    this._buffer = null;
    this._audioData = null;
    this._normalize = !disableNormalization;
  }

  /**
   * @return {AudioBuffer}
   */
  getBuffer() {
    return this._buffer;
  }

  /**
   * @param {AudioBuffer} value
   */
  setBuffer(value) {
    value = toImpl(value);

    /* istanbul ignore else */
    if (value instanceof AudioBuffer) {
      this._buffer = value;
      this._audioData = this._buffer.audioData;
    }
  }

  /**
   * @return {boolean}
   */
  getNormalize() {
    return this._normalize;
  }

  /**
   * @param {boolean} value
   */
  setNormalize(value) {
    this._normalize = !!value;
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    numberOfChannels = Math.min(numberOfChannels, 2);

    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }
}

Object.assign(ConvolverNode.prototype, ConvolverNodeDSP);

const DelayNodeDSP = {
  dspInit(maxDelayTime) {
    this._kernels = [];
    this._delayBufferLength = this.dspComputeDelayBufferLength(maxDelayTime);
    this._delayIndices = new Float32Array(this.blockSize);
  },

  dspComputeDelayBufferLength(delayTime) {
    return (
      Math.ceil((delayTime * this.sampleRate) / this.blockSize) *
        this.blockSize +
      this.blockSize
    );
  },

  dspUpdateKernel(numberOfChannels) {
    if (numberOfChannels < this._kernels.length) {
      this._kernels.splice(numberOfChannels);
    } else if (this._kernels.length < numberOfChannels) {
      while (numberOfChannels !== this._kernels.length) {
        this._kernels.push(new DelayKernel(this, this._kernels.length));
      }
    }

    assert(numberOfChannels === this._kernels.length);

    switch (numberOfChannels) {
      case 1:
        this.dspProcess = this.dspProcess1;
        break;
      case 2:
        this.dspProcess = this.dspProcess2;
        break;
      default:
        this.dspProcess = this.dspProcessN;
        break;
    }
  },

  dspProcess1() {
    const blockSize = this.blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const delayIndices = this._delayIndices;
    const kernel = this._kernels[0];

    if (this._delayTime.hasSampleAccurateValues()) {
      kernel.computeAccurateDelayIndices(
        delayIndices,
        this._delayTime.getSampleAccurateValues(),
      );
      kernel.processWithAccurateDelayIndices(
        inputs[0],
        outputs[0],
        delayIndices,
        blockSize,
      );
    } else {
      kernel.computeStaticDelayIndices(
        delayIndices,
        this._delayTime.getValue(),
      );
      kernel.processWithStaticDelayIndices(
        inputs[0],
        outputs[0],
        delayIndices,
        blockSize,
      );
    }
  },

  dspProcess2() {
    const blockSize = this.blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const delayIndices = this._delayIndices;
    const kernels = this._kernels;

    if (this._delayTime.hasSampleAccurateValues()) {
      kernels[0].computeAccurateDelayIndices(
        delayIndices,
        this._delayTime.getSampleAccurateValues(),
      );
      kernels[0].processWithAccurateDelayIndices(
        inputs[0],
        outputs[0],
        delayIndices,
        blockSize,
      );
      kernels[1].processWithAccurateDelayIndices(
        inputs[1],
        outputs[1],
        delayIndices,
        blockSize,
      );
    } else {
      kernels[0].computeStaticDelayIndices(
        delayIndices,
        this._delayTime.getValue(),
      );
      kernels[0].processWithStaticDelayIndices(
        inputs[0],
        outputs[0],
        delayIndices,
        blockSize,
      );
      kernels[1].processWithStaticDelayIndices(
        inputs[1],
        outputs[1],
        delayIndices,
        blockSize,
      );
    }
  },

  dspProcessN() {
    const blockSize = this.blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const delayIndices = this._delayIndices;
    const kernels = this._kernels;

    if (this._delayTime.hasSampleAccurateValues()) {
      kernels[0].computeAccurateDelayIndices(
        delayIndices,
        this._delayTime.getSampleAccurateValues(),
      );

      for (let i = 0, imax = kernels.length; i < imax; i++) {
        kernels[i].processWithAccurateDelayIndices(
          inputs[i],
          outputs[i],
          delayIndices,
          blockSize,
        );
      }
    } else {
      kernels[0].computeStaticDelayIndices(
        delayIndices,
        this._delayTime.getValue(),
      );

      for (let i = 0, imax = kernels.length; i < imax; i++) {
        kernels[i].processWithStaticDelayIndices(
          inputs[i],
          outputs[i],
          delayIndices,
          blockSize,
        );
      }
    }
  },
};

class DelayKernel {
  constructor(delayNode) {
    this._sampleRate = delayNode.sampleRate;
    this._maxDelayTime = delayNode._maxDelayTime;
    this._delayBufferLength = delayNode._delayBufferLength;
    this._delayBuffer = new Float32Array(this._delayBufferLength);
    this._virtualDelayIndex = 0;
  }

  computeStaticDelayIndices(delayIndices, delayTime) {
    const sampleRate = this._sampleRate;
    const maxDelayTime = this._maxDelayTime;
    const delayBufferLength = this._delayBufferLength;
    const virtualReadIndex = this._virtualDelayIndex;

    delayTime = Math.max(0, Math.min(delayTime, maxDelayTime));

    let delayIndex = virtualReadIndex - delayTime * sampleRate;

    if (delayIndex < 0) {
      delayIndex += delayBufferLength;
    }

    for (let i = 0, imax = delayIndices.length; i < imax; i++) {
      delayIndices[i] = delayIndex++;
      if (delayBufferLength <= delayIndex) {
        delayIndex -= delayBufferLength;
      }
    }

    return delayIndices;
  }

  computeAccurateDelayIndices(delayIndices, delayTimes) {
    const sampleRate = this._sampleRate;
    const maxDelayTime = this._maxDelayTime;
    const delayBufferLength = this._delayBufferLength;
    const virtualReadIndex = this._virtualDelayIndex;

    for (let i = 0, imax = delayIndices.length; i < imax; i++) {
      const delayTime = Math.max(0, Math.min(delayTimes[i], maxDelayTime));

      let delayIndex = virtualReadIndex + i - delayTime * sampleRate;

      if (delayIndex < 0) {
        delayIndex += delayBufferLength;
      }

      delayIndices[i] = delayIndex;
    }

    return delayIndices;
  }

  processWithStaticDelayIndices(input, output, delayIndices, inNumSamples) {
    const delayBufferLength = this._delayBufferLength;
    const delayBuffer = this._delayBuffer;

    this._delayBuffer.set(input, this._virtualDelayIndex);

    const ia = delayIndices[0] % 1;

    if (ia === 0) {
      for (let i = 0; i < inNumSamples; i++) {
        output[i] = delayBuffer[delayIndices[i]];
      }
    } else {
      for (let i = 0; i < inNumSamples; i++) {
        const i0 = delayIndices[i] | 0;
        const i1 = (i0 + 1) % delayBufferLength;

        output[i] = delayBuffer[i0] + ia * (delayBuffer[i1] - delayBuffer[i0]);
      }
    }

    this._virtualDelayIndex += inNumSamples;

    if (this._virtualDelayIndex === delayBufferLength) {
      this._virtualDelayIndex = 0;
    }
  }

  processWithAccurateDelayIndices(input, output, delayIndices, inNumSamples) {
    const delayBufferLength = this._delayBufferLength;
    const delayBuffer = this._delayBuffer;

    delayBuffer.set(input, this._virtualDelayIndex);

    for (let i = 0; i < inNumSamples; i++) {
      const ix = delayIndices[i];
      const i0 = ix | 0;
      const ia = ix % 1;

      if (ia === 0) {
        output[i] = delayBuffer[i0];
      } else {
        const i1 = (i0 + 1) % delayBufferLength;

        output[i] = delayBuffer[i0] + ia * (delayBuffer[i1] - delayBuffer[i0]);
      }
    }

    this._virtualDelayIndex += inNumSamples;

    if (this._virtualDelayIndex === delayBufferLength) {
      this._virtualDelayIndex = 0;
    }
  }
}

const DEFAULT_MAX_DELAY_TIME = 1;
const DEFAULT_DELAY_TIME = 0;

class DelayNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.maxDelayTime
   * @param {number}       opts.delayTime
   */
  constructor(context, opts = {}) {
    let maxDelayTime = defaults(opts.maxDelayTime, DEFAULT_MAX_DELAY_TIME);
    let delayTime = defaults(opts.delayTime, DEFAULT_DELAY_TIME);

    maxDelayTime = Math.max(0, toNumber(maxDelayTime));
    delayTime = Math.min(delayTime, maxDelayTime);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._maxDelayTime = maxDelayTime;
    this._delayTime = this.addParam(AUDIO_RATE, delayTime);

    this.dspInit(this._maxDelayTime);
    this.dspUpdateKernel(1);
  }

  /**
   * @return {number}
   */
  getDelayTime() {
    return this._delayTime;
  }

  /**
   * @return {number}
   */
  getMaxDelayTime() {
    return this._maxDelayTime;
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.dspUpdateKernel(numberOfChannels);
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }

  /**
   * @return {number}
   */
  getTailTime() {
    return this._maxDelayTime;
  }
}

Object.assign(DelayNode.prototype, DelayNodeDSP);

const DEFAULT_PRE_DELAY_FRAMES = 256;
const MAX_PRE_DELAY_FRAMES = 1024;
const MAX_PRE_DELAY_FRAMES_MASK = MAX_PRE_DELAY_FRAMES - 1;
const PI_OVER_2 = Math.PI / 2;
// Metering hits peaks instantly, but releases this fast (in seconds).
const METERING_RELEASE_TIME_CONSTANT = 0.325;

function discreteTimeConstantForSampleRate(timeConstant, sampleRate) {
  // From the WebAudio spec, the formula for setTargetAtTime is
  //
  //   v(t) = V1 + (V0 - V1)*exp(-t/tau)
  //
  // where tau is the time constant, V1 is the target value and V0 is
  // the starting value.
  //
  // Rewrite this as
  //
  //   v(t) = V0 + (V1 - V0)*(1-exp(-t/tau))
  //
  // The implementation of setTargetAtTime uses this form.  So at the
  // sample points, we have
  //
  //   v(n/Fs) = V0 + (V1 - V0)*(1-exp(-n/(Fs*tau)))
  //
  // where Fs is the sample rate of the sampled systme.  Thus, the
  // discrete time constant is
  //
  //   1 - exp(-1/(Fs*tau)
  return 1 - Math.exp(-1 / (sampleRate * timeConstant));
}

class DynamicsCompressorKernel {
  constructor(sampleRate, numberOfChannels) {
    this.sampleRate = sampleRate;
    this.lastPreDelayFrames = DEFAULT_PRE_DELAY_FRAMES;
    this.preDelayReadIndex = 0;
    this.preDelayWriteIndex = DEFAULT_PRE_DELAY_FRAMES;
    this.ratio = undefined;
    this.slope = undefined;
    this.linearThreshold = undefined;
    this.dbThreshold = undefined;
    this.dbKnee = undefined;
    this.kneeThreshold = undefined;
    this.kneeThresholdDb = undefined;
    this.ykneeThresholdDb = undefined;
    this.K = undefined;
    this.preDelayBuffers = [];

    this.setNumberOfChannels(numberOfChannels);

    // Initializes most member variables;
    this.reset();

    this.meteringReleaseK = discreteTimeConstantForSampleRate(
      METERING_RELEASE_TIME_CONSTANT,
      sampleRate,
    );
  }

  setNumberOfChannels(numberOfChannels) {
    if (this.preDelayBuffers.length === numberOfChannels) {
      return;
    }

    this.preDelayBuffers = [];
    for (let i = 0; i < numberOfChannels; i++) {
      this.preDelayBuffers.push(new Float32Array(MAX_PRE_DELAY_FRAMES));
    }
  }

  setPreDelayTime(preDelayTime) {
    let preDelayFrames = preDelayTime * this.sampleRate;
    if (preDelayFrames > MAX_PRE_DELAY_FRAMES - 1) {
      preDelayFrames = MAX_PRE_DELAY_FRAMES - 1;
    }

    if (this.lastPreDelayFrames !== preDelayFrames) {
      this.lastPreDelayFrames = preDelayFrames;
      for (let i = 0; i < this.preDelayBuffers.length; i++) {
        this.preDelayBuffers[i].fill(0);
      }

      this.preDelayReadIndex = 0;
      this.preDelayWriteIndex = preDelayFrames;
    }
  }

  // Exponential curve for the knee.
  // It is 1st derivative matched at m_linearThreshold and asymptotically
  // approaches the value m_linearThreshold + 1 / k.
  kneeCurve(x, k) {
    // Linear up to threshold.
    if (x < this.linearThreshold) {
      return x;
    }
    return (
      this.linearThreshold + (1 - Math.exp(-k * (x - this.linearThreshold))) / k
    );
  }

  // Full compression curve with constant ratio after knee.
  saturate(x, k) {
    if (x < this.kneeThreshold) {
      return this.kneeCurve(x, k);
    }

    // Constant ratio after knee
    const xDb = toDecibel(x);
    const yDb =
      this.ykneeThresholdDb + this.slope * (xDb - this.kneeThresholdDb);
    return toLinear(yDb);
  }

  // Approximate 1st derivative with input and output expressed in dB.
  // This slope is equal to the inverse of the compression "ratio".
  // In other words, a compression ratio of 20 would be a slope of 1/20.
  slopeAt(x, k) {
    if (x < this.linearThreshold) {
      return 1;
    }

    const x2 = x * 1.001;

    const xDb = toDecibel(x);
    const x2Db = toDecibel(x2);

    const yDb = toDecibel(this.kneeCurve(x, k));
    const y2Db = toDecibel(this.kneeCurve(x2, k));

    return (y2Db - yDb) / (x2Db - xDb);
  }

  kAtSlope(desiredSlope) {
    const xDb = this.dbThreshold + this.dbKnee;
    const x = toLinear(xDb);

    // Approximate k given initial values.
    let minK = 0.1;
    let maxK = 10000;
    let k = 5;

    for (let i = 0; i < 15; i++) {
      // A high value for k will more quickly asymptotically approach a slope of 0.
      const slope = this.slopeAt(x, k);

      if (slope < desiredSlope) {
        // k is too high
        maxK = k;
      } else {
        // k is too low
        minK = k;
      }

      // Re-calculate based on geometric mean
      k = Math.sqrt(minK * maxK);
    }

    return k;
  }

  updateStaticCurveParameters(dbThreshold, dbKnee, ratio) {
    if (
      dbThreshold !== this.dbThreshold ||
      dbKnee !== this.dbKnee ||
      ratio !== this.ratio
    ) {
      // Threshold and knee
      this.dbThreshold = dbThreshold;
      this.linearThreshold = toLinear(dbThreshold);
      this.dbKnee = dbKnee;

      // Compute knee parameters
      this.ratio = ratio;
      this.slope = 1 / ratio;

      const k = this.kAtSlope(this.slope);

      this.kneeThresholdDb = dbThreshold + dbKnee;
      this.kneeThreshold = toLinear(this.kneeThresholdDb);

      this.ykneeThresholdDb = toDecibel(this.kneeCurve(this.kneeThreshold, k));

      this.K = k;
    }
    return this.K;
  }

  process(
    sourceChannels,
    destinationChannels,
    numberOfChannels,
    framesToProcess,
    dbThreshold,
    dbKnee,
    ratio,
    attackTime,
    releaseTime,
    preDelayTime,
    dbPostGain,
    effectBlend, // equal power crossfade
    releaseZone1,
    releaseZone2,
    releaseZone3,
    releaseZone4,
  ) {
    assert(this.preDelayBuffers.length === numberOfChannels);

    const sampleRate = this.sampleRate;

    const dryMix = 1 - effectBlend;
    const wetMix = effectBlend;

    const k = this.updateStaticCurveParameters(dbThreshold, dbKnee, ratio);

    // Makeup gain.
    const fullRangeGain = this.saturate(1, k);
    let fullRangeMakeupGain = 1 / fullRangeGain;

    // Empirical/perceptual tuning.
    fullRangeMakeupGain = Math.pow(fullRangeMakeupGain, 0.6);

    const masterLinearGain = toLinear(dbPostGain) * fullRangeMakeupGain;

    // Attack parameters.
    attackTime = Math.max(0.001, attackTime);
    const attackFrames = attackTime * sampleRate;

    // Release parameters.
    const releaseFrames = releaseTime * sampleRate;

    // Detector release time
    const satReleaseTime = 0.0025;
    const satReleaseFrames = satReleaseTime * sampleRate;

    // Create a smooth function which passes through four points

    // Polynomial of the form
    // y = a + b*x + c*x^2 + d*x^3 + e*x^4;

    const y1 = releaseFrames * releaseZone1;
    const y2 = releaseFrames * releaseZone2;
    const y3 = releaseFrames * releaseZone3;
    const y4 = releaseFrames * releaseZone4;

    // All of these coefficients were derived for 4th order polynomial curve fitting where the y values
    // match the evenly spaced x values as follows: (y1 : x == 0, y2 : x == 1, y3 : x == 2, y4 : x == 3)
    const kA =
      0.9999999999999998 * y1 +
      1.8432219684323923e-16 * y2 -
      1.9373394351676423e-16 * y3 +
      8.824516011816245e-18 * y4;
    const kB =
      -1.5788320352845888 * y1 +
      2.3305837032074286 * y2 -
      0.9141194204840429 * y3 +
      0.1623677525612032 * y4;
    const kC =
      0.5334142869106424 * y1 -
      1.272736789213631 * y2 +
      0.9258856042207512 * y3 -
      0.18656310191776226 * y4;
    const kD =
      0.08783463138207234 * y1 -
      0.1694162967925622 * y2 +
      0.08588057951595272 * y3 -
      0.00429891410546283 * y4;
    const kE =
      -0.042416883008123074 * y1 +
      0.1115693827987602 * y2 -
      0.09764676325265872 * y3 +
      0.028494263462021576 * y4;

    // x ranges from 0 -> 3       0    1    2   3
    //                           -15  -10  -5   0db

    // y calculates adaptive release frames depending on the amount of compression.

    this.setPreDelayTime(preDelayTime);

    const nDivisionFrames = 32;
    const nDivisions = framesToProcess / nDivisionFrames;

    let frameIndex = 0;
    for (let i = 0; i < nDivisions; i++) {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Calculate desired gain
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // Fix gremlins.
      if (isNaN(this.detectorAverage)) {
        this.detectorAverage = 1;
      }
      if (
        this.detectorAverage === Infinity ||
        this.detectorAverage === -Infinity
      ) {
        this.detectorAverage = 1;
      }

      const desiredGain = this.detectorAverage;

      // Pre-warp so we get desiredGain after sin() warp below.
      const scaledDesiredGain = Math.asin(desiredGain) / PI_OVER_2;

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Deal with envelopes
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // envelopeRate is the rate we slew from current compressor level to the desired level.
      // The exact rate depends on if we're attacking or releasing and by how much.
      let envelopeRate = 0;

      const isReleasing = scaledDesiredGain > this.compressorGain;

      // compressionDiffDb is the difference between current compression level and the desired level.
      let compressionDiffDb = toDecibel(
        this.compressorGain / scaledDesiredGain,
      );

      if (isReleasing) {
        // Release mode - compressionDiffDb should be negative dB
        this.maxAttackCompressionDiffDb = -1;

        // Fix gremlins.
        if (isNaN(compressionDiffDb)) {
          compressionDiffDb = -1;
        }
        if (compressionDiffDb === Infinity || compressionDiffDb === -Infinity) {
          compressionDiffDb = -1;
        }

        // Adaptive release - higher compression (lower compressionDiffDb)  releases faster.

        // Contain within range: -12 -> 0 then scale to go from 0 -> 3
        let x = compressionDiffDb;
        x = Math.max(-12, x);
        x = Math.min(0, x);
        x = 0.25 * (x + 12);

        // Compute adaptive release curve using 4th order polynomial.
        // Normal values for the polynomial coefficients would create a monotonically increasing function.
        const x2 = x * x;
        const x3 = x2 * x;
        const x4 = x2 * x2;
        const releaseFrames = kA + kB * x + kC * x2 + kD * x3 + kE * x4;

        const kSpacingDb = 5;
        const dbPerFrame = kSpacingDb / releaseFrames;

        envelopeRate = toLinear(dbPerFrame);
      } else {
        // Attack mode - compressionDiffDb should be positive dB

        // Fix gremlins.
        if (isNaN(compressionDiffDb)) {
          compressionDiffDb = 1;
        }
        if (compressionDiffDb === Infinity || compressionDiffDb === -Infinity) {
          compressionDiffDb = 1;
        }

        // As long as we're still in attack mode, use a rate based off
        // the largest compressionDiffDb we've encountered so far.
        if (
          this.maxAttackCompressionDiffDb === -1 ||
          this.maxAttackCompressionDiffDb < compressionDiffDb
        ) {
          this.maxAttackCompressionDiffDb = compressionDiffDb;
        }

        const effAttenDiffDb = Math.max(0.5, this.maxAttackCompressionDiffDb);

        const x = 0.25 / effAttenDiffDb;
        envelopeRate = 1 - Math.pow(x, 1 / attackFrames);
      }

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Inner loop - calculate shaped power average - apply compression.
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      {
        let preDelayReadIndex = this.preDelayReadIndex;
        let preDelayWriteIndex = this.preDelayWriteIndex;
        let detectorAverage = this.detectorAverage;
        let compressorGain = this.compressorGain;

        let loopFrames = nDivisionFrames;
        while (loopFrames--) {
          let compressorInput = 0;

          // Predelay signal, computing compression amount from un-delayed version.
          for (let i = 0; i < numberOfChannels; i++) {
            const delayBuffer = this.preDelayBuffers[i];
            const undelayedSource = sourceChannels[i][frameIndex];
            delayBuffer[preDelayWriteIndex] = undelayedSource;

            const absUndelayedSource =
              undelayedSource > 0 ? undelayedSource : -undelayedSource;
            if (compressorInput < absUndelayedSource) {
              compressorInput = absUndelayedSource;
            }
          }

          // Calculate shaped power on undelayed input.

          const scaledInput = compressorInput;
          const absInput = scaledInput > 0 ? scaledInput : -scaledInput;

          // Put through shaping curve.
          // This is linear up to the threshold, then enters a "knee" portion followed by the "ratio" portion.
          // The transition from the threshold to the knee is smooth (1st derivative matched).
          // The transition from the knee to the ratio portion is smooth (1st derivative matched).
          const shapedInput = this.saturate(absInput, k);

          const attenuation = absInput <= 0.0001 ? 1 : shapedInput / absInput;

          let attenuationDb = -toDecibel(attenuation);
          attenuationDb = Math.max(2, attenuationDb);

          const dbPerFrame = attenuationDb / satReleaseFrames;

          const satReleaseRate = toLinear(dbPerFrame) - 1;

          const isRelease = attenuation > detectorAverage;
          const rate = isRelease ? satReleaseRate : 1;

          detectorAverage += (attenuation - detectorAverage) * rate;
          detectorAverage = Math.min(1, detectorAverage);

          // Fix gremlins.
          if (isNaN(detectorAverage)) {
            detectorAverage = 1;
          }
          if (detectorAverage === Infinity || detectorAverage === -Infinity) {
            detectorAverage = 1;
          }

          // Exponential approach to desired gain
          if (envelopeRate < 1) {
            // Attack - reduce gain to desired
            compressorGain +=
              (scaledDesiredGain - compressorGain) * envelopeRate;
          } else {
            // Release - exponentially increase gain to 1.0
            compressorGain *= envelopeRate;
            compressorGain = Math.min(1, compressorGain);
          }

          // Warp pre-compression gain to smooth out sharp exponential transition points.
          const postWarpCompressorGain = Math.sin(PI_OVER_2 * compressorGain);

          // Calculate total gain using master gain and effect blend.
          const totalGain =
            dryMix + wetMix * masterLinearGain * postWarpCompressorGain;

          // Calculte metering.
          const dbRealGain = 20 * Math.log10(postWarpCompressorGain);
          if (dbRealGain < this.meteringGain) {
            this.meteringGain = dbRealGain;
          } else {
            this.meteringGain +=
              (dbRealGain - this.meteringGain) * this.meteringReleaseK;
          }

          // Apply final gain
          for (let i = 0; i < numberOfChannels; i++) {
            const delayBuffer = this.preDelayBuffers[i];
            destinationChannels[i][frameIndex] =
              delayBuffer[preDelayReadIndex] * totalGain;
          }

          frameIndex++;
          preDelayReadIndex =
            (preDelayReadIndex + 1) & MAX_PRE_DELAY_FRAMES_MASK;
          preDelayWriteIndex =
            (preDelayWriteIndex + 1) & MAX_PRE_DELAY_FRAMES_MASK;
        }

        // Locals back to member variables
        this.preDelayReadIndex = preDelayReadIndex;
        this.preDelayWriteIndex = preDelayWriteIndex;
        this.detectorAverage = flushDenormalFloatToZero(detectorAverage);
        this.compressorGain = flushDenormalFloatToZero(compressorGain);
      }
    }
  }

  reset() {
    this.detectorAverage = 0;
    this.compressorGain = 1;
    this.meteringGain = 1;

    // Predelay section.
    for (const buffer of this.preDelayBuffers) {
      buffer.fill(0);
    }

    this.preDelayReadIndex = 0;
    this.preDelayWriteIndex = DEFAULT_PRE_DELAY_FRAMES;

    this.maxAttackCompressionDiffDb = -1; // uninitialized state
  }
}

const THRESHOLD = 0;
const KNEE = 1;
const RATIO = 2;
const ATTACK = 3;
const RELEASE = 4;
const PRE_DELAY = 5;
const RELEASE_ZONE_1 = 6;
const RELEASE_ZONE_2 = 7;
const RELEASE_ZONE_3 = 8;
const RELEASE_ZONE_4 = 9;
const POST_GAIN = 10;
const FILTER_STAGE_GAIN = 11;
const FILTER_STAGE_RATIO = 12;
const FILTER_ANCHOR = 13;
const EFFECT_BLEND = 14;
const REDUCTION = 15;
const PARAM_LAST = 16;

const CompressorParameters = {
  THRESHOLD,
  KNEE,
  RATIO,
  ATTACK,
  RELEASE,
  REDUCTION,
};

class DynamicsCompressor {
  constructor(sampleRate, numberOfChannels) {
    this.numberOfChannels = numberOfChannels;
    this.sampleRate = sampleRate;
    this.nyquist = sampleRate / 2;
    this.compressor = new DynamicsCompressorKernel(
      sampleRate,
      numberOfChannels,
    );

    this.lastFilterStageRatio = -1;
    this.lastAnchor = -1;
    this.lastFilterStageGain = -1;

    this.parameters = new Array(PARAM_LAST);

    this.setNumberOfChannels(numberOfChannels);
    this.initializeParameters();
  }

  setParameterValue(parameterId, value) {
    if (parameterId < PARAM_LAST) {
      this.parameters[parameterId] = value;
    }
  }

  initializeParameters() {
    // Initializes compressor to default values.

    this.parameters[THRESHOLD] = -24; // dB
    this.parameters[KNEE] = 30; // dB
    this.parameters[RATIO] = 12; // unit-less
    this.parameters[ATTACK] = 0.003; // seconds
    this.parameters[RELEASE] = 0.25; // seconds
    this.parameters[PRE_DELAY] = 0.006; // seconds

    // Release zone values 0 -> 1.
    this.parameters[RELEASE_ZONE_1] = 0.09;
    this.parameters[RELEASE_ZONE_2] = 0.16;
    this.parameters[RELEASE_ZONE_3] = 0.42;
    this.parameters[RELEASE_ZONE_4] = 0.98;
    this.parameters[FILTER_STAGE_GAIN] = 4.4; // dB
    this.parameters[FILTER_STAGE_RATIO] = 2;
    this.parameters[FILTER_ANCHOR] = 15000 / this.nyquist;
    this.parameters[POST_GAIN] = 0; // dB
    this.parameters[REDUCTION] = 0; // dB

    // Linear crossfade (0 -> 1).
    this.parameters[EFFECT_BLEND] = 1;
  }

  parameterValue(parameterId) {
    return this.parameters[parameterId];
  }

  process(sourceBus, destinatonBus, framesToProcess) {
    // Though numberOfChannels is retrived from destinationBus, we still name it numberOfChannels instead of numberOfDestinationChannels.
    // It's because we internally match sourceChannels's size to destinationBus by channel up/down mix. Thus we need numberOfChannels
    // to do the loop work for both m_sourceChannels and m_destinationChannels.

    const numberOfChannels = destinatonBus.getNumberOfChannels();
    const numberOfSourceChannels = sourceBus.getNumberOfChannels();

    assert(numberOfChannels === this.numberOfChannels && numberOfChannels > 0);

    if (
      numberOfChannels !== this.numberOfChannels ||
      numberOfSourceChannels === 0
    ) {
      destinatonBus.zeros();
      return;
    }

    switch (numberOfChannels) {
      case 2: {
        // stereo
        this.sourceChannels[0] = sourceBus.getChannelData()[0];

        if (numberOfSourceChannels > 1) {
          this.sourceChannels[1] = sourceBus.getChannelData()[1];
        } else {
          // Simply duplicate mono channel input data to right channel for stereo processing.
          this.sourceChannels[1] = sourceBus.getChannelData()[0];
        }
        break;
      }
      default: {
        // FIXME : support other number of channels.
        assert(false);
        destinatonBus.zeros();
        return;
      }
    }

    for (let i = 0; i < numberOfChannels; i++) {
      this.destinationChannels[i] = destinatonBus.getMutableData()[i];
    }

    const filterStageGain = this.parameterValue(FILTER_STAGE_GAIN);
    const filterStageRatio = this.parameterValue(FILTER_STAGE_RATIO);
    const anchor = this.parameterValue(FILTER_ANCHOR);

    if (
      filterStageGain !== this.lastFilterStageGain ||
      filterStageRatio !== this.lastFilterStageRatio ||
      anchor !== this.lastAnchor
    ) {
      this.lastFilterStageGain = filterStageGain;
      this.lastFilterStageRatio = filterStageRatio;
      this.lastAnchor = anchor;
    }

    const dbThreshold = this.parameterValue(THRESHOLD);
    const dbKnee = this.parameterValue(KNEE);
    const ratio = this.parameterValue(RATIO);
    const attackTime = this.parameterValue(ATTACK);
    const releaseTime = this.parameterValue(RELEASE);
    const preDelayTime = this.parameterValue(PRE_DELAY);

    // This is effectively a master volume on the compressed signal (pre-blending).
    const dbPostGain = this.parameterValue(POST_GAIN);

    // Linear blending value from dry to completely processed (0 -> 1)
    // 0 means the signal is completely unprocessed.
    // 1 mixes in only the compressed signal.
    const effectBlend = this.parameterValue(EFFECT_BLEND);

    const releaseZone1 = this.parameterValue(RELEASE_ZONE_1);
    const releaseZone2 = this.parameterValue(RELEASE_ZONE_2);
    const releaseZone3 = this.parameterValue(RELEASE_ZONE_3);
    const releaseZone4 = this.parameterValue(RELEASE_ZONE_4);

    this.compressor.process(
      this.sourceChannels,
      this.destinationChannels,
      numberOfChannels,
      framesToProcess,

      dbThreshold,
      dbKnee,
      ratio,
      attackTime,
      releaseTime,
      preDelayTime,
      dbPostGain,
      effectBlend,

      releaseZone1,
      releaseZone2,
      releaseZone3,
      releaseZone4,
    );

    // Update the compression amount.
    this.setParameterValue(REDUCTION, this.compressor.meteringGain);
  }

  reset() {
    this.lastFilterStageRatio = -1; // for recalc
    this.lastAnchor = -1;
    this.lastFilterStageGain = -1;

    this.compressor.reset();
  }

  setNumberOfChannels(numberOfChannels) {
    this.sourceChannels = nmap(numberOfChannels, () => new Float32Array());
    this.destinationChannels = nmap(numberOfChannels, () => new Float32Array());

    this.compressor.setNumberOfChannels(numberOfChannels);
    this.numberOfChannels = numberOfChannels;
  }

  dspProcess(inputs, outputs, blockSize) {
    this.process(inputs[0].bus, outputs[0].bus, blockSize);
  }
}

const DEFAULT_THRESHOLD = -24;
const DEFAULT_KNEE = 30;
const DEFAULT_RATIO = 12;
const DEFAULT_ATTACK = 0.003;
const DEFAULT_RELEASE = 0.25;

class DynamicsCompressorNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.threshold
   * @param {number}       opts.knee
   * @param {number}       opts.ratio
   * @param {number}       opts.attack
   * @param {number}       opts.release
   */
  constructor(context, opts = {}) {
    const threshold = defaults(opts.threshold, DEFAULT_THRESHOLD);
    const knee = defaults(opts.knee, DEFAULT_KNEE);
    const ratio = defaults(opts.ratio, DEFAULT_RATIO);
    const attack = defaults(opts.attack, DEFAULT_ATTACK);
    const release = defaults(opts.release, DEFAULT_RELEASE);

    super(context, opts, {
      inputs: [1],
      outputs: [2],
      channelCount: 2,
      channelCountMode: EXPLICIT,
    });

    this._threshold = this.addParam(CONTROL_RATE, threshold);
    this._knee = this.addParam(CONTROL_RATE, knee);
    this._ratio = this.addParam(CONTROL_RATE, ratio);
    this._attack = this.addParam(CONTROL_RATE, attack);
    this._release = this.addParam(CONTROL_RATE, release);

    this.compressor = new DynamicsCompressor(
      this.sampleRate,
      this.outputs[0].getNumberOfChannels(),
    );
  }

  /**
   * @return {AudioParam}
   */
  getThreshold() {
    return this._threshold;
  }

  /**
   * @return {AudioParam}
   */
  getKnee() {
    return this._knee;
  }

  /**
   * @return {AudioParam}
   */
  getRatio() {
    return this._ratio;
  }

  /**
   * @return {number}
   */
  getReduction() {
    return this.compressor.parameterValue(CompressorParameters.REDUCTION);
  }

  /**
   * @return {AudioParam}
   */
  getAttack() {
    return this._attack;
  }

  /**
   * @return {AudioParam}
   */
  getRelease() {
    return this._release;
  }

  dspInit() {
    super.dspInit();
  }

  dspProcess() {
    super.dspProcess();

    this.compressor.setParameterValue(
      CompressorParameters.THRESHOLD,
      this._threshold.getValue(),
    );
    this.compressor.setParameterValue(
      CompressorParameters.KNEE,
      this._knee.getValue(),
    );
    this.compressor.setParameterValue(
      CompressorParameters.RATIO,
      this._ratio.getValue(),
    );
    this.compressor.setParameterValue(
      CompressorParameters.ATTACK,
      this._attack.getValue(),
    );
    this.compressor.setParameterValue(
      CompressorParameters.RELEASE,
      this._release.getValue(),
    );

    this.compressor.dspProcess(this.inputs, this.outputs, this.blockSize);
  }
}

const DSPAlgorithm$1 = {};

const GainNodeDSP = {
  dspProcess() {
    const inputBus = this.inputs[0].bus;
    const outputBus = this.outputs[0].bus;

    if (inputBus.isSilent) {
      outputBus.zeros();
      return;
    }

    const gainParam = this._gain;

    if (gainParam.hasSampleAccurateValues()) {
      const inputs = inputBus.getChannelData();
      const outputs = outputBus.getMutableData();
      const gainValues = gainParam.getSampleAccurateValues();
      const numberOfChannels = inputs.length;
      const dsp = selectAlgorithm(numberOfChannels, 1000);

      dsp(inputs, outputs, gainValues, this.blockSize);

      return;
    }

    const gainValue = gainParam.getValue();

    if (gainValue === 0) {
      outputBus.zeros();
      return;
    }

    if (gainValue === 1) {
      outputBus.copyFrom(inputBus);
      return;
    }

    const inputs = inputBus.getChannelData();
    const outputs = outputBus.getMutableData();
    const numberOfChannels = outputs.length;
    const dsp = selectAlgorithm(numberOfChannels, 2000);

    dsp(inputs, outputs, gainValue, this.blockSize);
  },
};

function selectAlgorithm(numberOfChannels, base) {
  const algorithmIndex = numberOfChannels + base;

  if (DSPAlgorithm$1[algorithmIndex]) {
    return DSPAlgorithm$1[algorithmIndex];
  }

  return DSPAlgorithm$1[base];
}

DSPAlgorithm$1[1000] = (inputs, outputs, gainValues, blockSize) => {
  const numberOfChannels = inputs.length;

  for (let ch = 0; ch < numberOfChannels; ch++) {
    for (let i = 0; i < blockSize; i++) {
      outputs[ch][i] = inputs[ch][i] * gainValues[i];
    }
  }
};

DSPAlgorithm$1[1001] = (inputs, outputs, gainValues, blockSize) => {
  const input = inputs[0];
  const output = outputs[0];

  for (let i = 0; i < blockSize; i++) {
    output[i] = input[i] * gainValues[i];
  }
};

DSPAlgorithm$1[1002] = (inputs, outputs, gainValues, blockSize) => {
  const inputL = inputs[0];
  const inputR = inputs[1];
  const outputL = outputs[0];
  const outputR = outputs[1];

  for (let i = 0; i < blockSize; i++) {
    outputL[i] = inputL[i] * gainValues[i];
    outputR[i] = inputR[i] * gainValues[i];
  }
};

DSPAlgorithm$1[2000] = (inputs, outputs, gainValue, blockSize) => {
  const numberOfChannels = inputs.length;

  for (let ch = 0; ch < numberOfChannels; ch++) {
    for (let i = 0; i < blockSize; i++) {
      outputs[ch][i] = inputs[ch][i] * gainValue;
    }
  }
};

DSPAlgorithm$1[2001] = (inputs, outputs, gainValue, blockSize) => {
  const input = inputs[0];
  const output = outputs[0];

  for (let i = 0; i < blockSize; i++) {
    output[i] = input[i] * gainValue;
  }
};

DSPAlgorithm$1[2002] = (inputs, outputs, gainValue, blockSize) => {
  const inputL = inputs[0];
  const inputR = inputs[1];
  const outputL = outputs[0];
  const outputR = outputs[1];

  for (let i = 0; i < blockSize; i++) {
    outputL[i] = inputL[i] * gainValue;
    outputR[i] = inputR[i] * gainValue;
  }
};

const DEFAULT_GAIN$1 = 1;

class GainNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.gain
   */
  constructor(context, opts = {}) {
    const gain = defaults(opts.gain, DEFAULT_GAIN$1);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._gain = this.addParam(AUDIO_RATE, gain);
  }

  /**
   * @return {AudioParam}
   */
  getGain() {
    return this._gain;
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }
}

Object.assign(GainNode.prototype, GainNodeDSP);

class IIRFilterKernel {
  constructor(feedforward, feedback) {
    this.a = toCoefficient(feedback, feedback[0]);
    this.b = toCoefficient(feedforward, feedback[0]);
    this.x = new Float32Array(this.b.length);
    this.y = new Float32Array(this.a.length);
  }

  process(input, output, inNumSamples) {
    const a = this.a;
    const b = this.b;
    const x = this.x;
    const y = this.y;
    const alen = this.a.length - 1;
    const blen = this.b.length;

    for (let i = 0; i < inNumSamples; i++) {
      x[blen - 1] = input[i];
      y[alen] = 0;

      for (let j = 0; j < blen; j++) {
        y[alen] += b[j] * x[j];
        x[j] = flushDenormalFloatToZero$1(x[j + 1]);
      }

      for (let j = 0; j < alen; j++) {
        y[alen] -= a[j] * y[j];
        y[j] = flushDenormalFloatToZero$1(y[j + 1]);
      }

      output[i] = y[alen];
    }
  }
}

function toCoefficient(filter, a0) {
  const coeff = new Float32Array(filter.length);

  for (let i = 0, imax = coeff.length; i < imax; i++) {
    coeff[i] = filter[imax - i - 1] / a0;
  }

  return coeff;
}

function flushDenormalFloatToZero$1(f) {
  return Math.abs(f) < 1.175494e-38 ? 0.0 : f;
}

const IIRFilterNodeDSP = {
  dspInit() {
    this._kernels = [];
  },

  dspUpdateKernel(numberOfChannels) {
    if (numberOfChannels < this._kernels.length) {
      this._kernels.splice(numberOfChannels);
    } else if (this._kernels.length < numberOfChannels) {
      while (numberOfChannels !== this._kernels.length) {
        this._kernels.push(
          new IIRFilterKernel(this._feedforward, this._feedback),
        );
      }
    }

    assert(numberOfChannels === this._kernels.length);

    switch (numberOfChannels) {
      case 1:
        this.dspProcess = this.dspProcess1;
        break;
      case 2:
        this.dspProcess = this.dspProcess2;
        break;
      default:
        this.dspProcess = this.dspProcessN;
        break;
    }
  },

  dspProcess1() {
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const kernels = this._kernels;

    kernels[0].process(inputs[0], outputs[0], this.blockSize);
  },

  dspProcess2() {
    const blockSize = this.blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const kernels = this._kernels;

    kernels[0].process(inputs[0], outputs[0], blockSize);
    kernels[1].process(inputs[1], outputs[1], blockSize);
  },

  dspProcessN() {
    const blockSize = this.blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const kernels = this._kernels;

    for (let i = 0, imax = kernels.length; i < imax; i++) {
      kernels[i].process(inputs[i], outputs[i], blockSize);
    }
  },

  dspGetFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    const b = this._feedforward;
    const a = this._feedback;

    getFilterResponse(
      b,
      a,
      frequencyHz,
      magResponse,
      phaseResponse,
      this.sampleRate,
    );
  },
};

class IIRFilterNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {Float32Array} opts.feedforward
   * @param {Float32Array} opts.feedback
   */
  constructor(context, opts = {}) {
    const feedforward = defaults(opts.feedforward, [0]);
    const feedback = defaults(opts.feedback, [1]);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._feedforward = feedforward;
    this._feedback = feedback;

    this.dspInit();
    this.dspUpdateKernel(1);
  }

  /**
   * @param {Float32Array} frequencyHz
   * @param {Float32Array} magResponse
   * @param {Float32Array} phaseResponse
   */
  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this.dspGetFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }

  /**
   * @return {Float32Array}
   */
  getFeedforward() {
    return this._feedforward;
  }

  /**
   * @return {Float32Array}
   */
  getFeedback() {
    return this._feedback;
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.dspUpdateKernel(numberOfChannels);
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }
}

Object.assign(IIRFilterNode.prototype, IIRFilterNodeDSP);

const WAVE_TABLE_LENGTH = 8192;

const PeriodicWaveDSP = {
  dspInit() {
    this._waveTable = null;
  },

  dspBuildWaveTable() {
    if (this._waveTable !== null) {
      return this._waveTable;
    }

    const waveTable = new Float32Array(WAVE_TABLE_LENGTH + 1);
    const real = this._real;
    const imag = this._imag;

    let maxAbsValue = 0;
    const periodicWaveLength = Math.min(real.length, 16);

    for (let i = 0; i < WAVE_TABLE_LENGTH; i++) {
      const x = (i / WAVE_TABLE_LENGTH) * Math.PI * 2;

      for (let n = 1; n < periodicWaveLength; n++) {
        waveTable[i] += real[n] * Math.cos(n * x) + imag[n] * Math.sin(n * x);
      }

      maxAbsValue = Math.max(maxAbsValue, Math.abs(waveTable[i]));
    }

    if (!this._constants && maxAbsValue !== 1) {
      for (let i = 0; i < WAVE_TABLE_LENGTH; i++) {
        waveTable[i] *= maxAbsValue;
      }
    }
    waveTable[WAVE_TABLE_LENGTH] = waveTable[0];

    this._waveTable = waveTable;

    return waveTable;
  },
};

const SINE = 'sine';
const SAWTOOTH = 'sawtooth';
const TRIANGLE = 'triangle';
const SQUARE = 'square';
const CUSTOM = 'custom';

class PeriodicWave {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {Float32Array} opts.real
   * @param {Float32Array} opts.imag
   * @param {boolean}      opts.constraints
   */
  constructor(context, opts = {}) {
    const real = opts.real;
    const imag = opts.imag;
    const constraints = opts.constraints;

    this.context = context;
    this._real = real;
    this._imag = imag;
    this._constants = !!constraints;
    this._name = CUSTOM;

    this.dspInit();
  }

  /**
   * @return {Float32Array}
   */
  getReal() {
    return this._real;
  }

  /**
   * @return {Float32Array}
   */
  getImag() {
    return this._imag;
  }

  /**
   * @return {booleam}
   */
  getConstraints() {
    return this._constants;
  }

  /**
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * @return {Float32Array}
   */
  getWaveTable() {
    if (!this._waveTable) {
      this._waveTable = this.dspBuildWaveTable();
    }
    return this._waveTable;
  }

  generateBasicWaveform(type) {
    const length = 512;

    switch (type) {
      case SINE:
        this._real = new Float32Array([0, 0]);
        this._imag = new Float32Array([0, 1]);
        this._name = SINE;
        break;
      case SAWTOOTH:
        this._real = new Float32Array(length);
        this._imag = new Float32Array(
          nmap(length, (_, n) => {
            return n === 0 ? 0 : Math.pow(-1, n + 1) * (2 / (n * Math.PI));
          }),
        );
        this._name = SAWTOOTH;
        this.dspBuildWaveTable();
        break;
      case TRIANGLE:
        this._real = new Float32Array(length);
        this._imag = new Float32Array(
          nmap(length, (_, n) => {
            return n === 0
              ? 0
              : (8 * Math.sin((n * Math.PI) / 2)) / Math.pow(n * Math.PI, 2);
          }),
        );
        this._name = TRIANGLE;
        this.dspBuildWaveTable();
        break;
      case SQUARE:
        this._real = new Float32Array(length);
        this._imag = new Float32Array(
          nmap(length, (_, n) => {
            return n === 0 ? 0 : (2 / (n * Math.PI)) * (1 - Math.pow(-1, n));
          }),
        );
        this._name = SQUARE;
        this.dspBuildWaveTable();
        break;
      default:
        this._real = new Float32Array([0]);
        this._imag = new Float32Array([0]);
        this._name = CUSTOM;
        this.dspBuildWaveTable();
        break;
    }
  }
}

Object.assign(PeriodicWave.prototype, PeriodicWaveDSP);

const OscillatorNodeDSP = {
  dspInit() {
    this._phase = 0;
  },

  dspProcess() {
    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const sampleOffset = Math.max(0, this._startFrame - quantumStartFrame);
    const fillToSample =
      Math.min(quantumEndFrame, this._stopFrame) - quantumStartFrame;
    const output = this.outputs[0].bus.getMutableData()[0];

    let writeIndex = 0;

    if (this._type === SINE) {
      writeIndex = this.dspSine(
        output,
        sampleOffset,
        fillToSample,
        this.sampleRate,
      );
    } else {
      writeIndex = this.dspWave(
        output,
        sampleOffset,
        fillToSample,
        this.sampleRate,
      );
    }

    // timeline
    // |----------------|-------*--------|----------------|----------------|
    //                  ^       ^        ^
    //                  |------>|        quantumEndFrame
    //                  | wrote |
    //                  |       stopFrame
    //                  quantumStartFrame
    if (this._stopFrame <= quantumStartFrame + writeIndex) {
      // rest samples fill zero
      while (writeIndex < blockSize) {
        output[writeIndex++] = 0;
      }

      this.context.addPostProcess(() => {
        this.outputs[0].bus.zeros();
        this.outputs[0].disable();
        this.dispatchEvent({ type: 'ended' });
      });
    }
  },

  dspSine(output, writeIndex, blockSize, sampleRate) {
    const frequency = this._frequency;
    const detune = this._detune;
    const algorithm =
      frequency.hasSampleAccurateValues() * 2 +
      detune.hasSampleAccurateValues();
    const frequencyToPhaseIncr = (2 * Math.PI) / sampleRate;

    let phase = this._phase;

    if (algorithm === 0) {
      const frequencyValue = frequency.getValue();
      const detuneValue = detune.getValue();
      const computedFrequency =
        frequencyValue * Math.pow(2, detuneValue / 1200);
      const phaseIncr = frequencyToPhaseIncr * computedFrequency;

      while (writeIndex < blockSize) {
        output[writeIndex++] = Math.sin(phase);
        phase += phaseIncr;
      }
    } else {
      const frequencyValues = frequency.getSampleAccurateValues();
      const detuneValues = detune.getSampleAccurateValues();

      while (writeIndex < blockSize) {
        const frequencyValue = frequencyValues[writeIndex];
        const detuneValue = detuneValues[writeIndex];
        const computedFrequency =
          frequencyValue * Math.pow(2, detuneValue / 1200);

        output[writeIndex++] = Math.sin(phase);
        phase += frequencyToPhaseIncr * computedFrequency;
      }
    }

    this._phase = phase;

    return writeIndex;
  },

  dspWave(output, writeIndex, blockSize, sampleRate) {
    const frequency = this._frequency;
    const detune = this._detune;
    const algorithm =
      frequency.hasSampleAccurateValues() * 2 +
      detune.hasSampleAccurateValues();
    const waveTable = this._waveTable;
    const waveTableLength = waveTable.length - 1;
    const frequencyToPhaseIncr = 1 / sampleRate;

    let phase = this._phase;

    if (algorithm === 0) {
      const frequencyValue = frequency.getValue();
      const detuneValue = detune.getValue();
      const computedFrequency =
        frequencyValue * Math.pow(2, detuneValue / 1200);
      const phaseIncr = frequencyToPhaseIncr * computedFrequency;

      while (writeIndex < blockSize) {
        const idx = (phase * waveTableLength) % waveTableLength;
        const v0 = waveTable[idx | 0];
        const v1 = waveTable[(idx | 0) + 1];

        output[writeIndex++] = v0 + (idx % 1) * (v1 - v0);
        phase += phaseIncr;
      }
    } else {
      const frequencyValues = frequency.getSampleAccurateValues();
      const detuneValues = detune.getSampleAccurateValues();

      while (writeIndex < blockSize) {
        const frequencyValue = frequencyValues[writeIndex];
        const detuneValue = detuneValues[writeIndex];
        const computedFrequency =
          frequencyValue * Math.pow(2, detuneValue / 1200);
        const idx = (phase * waveTableLength) % waveTableLength;
        const v0 = waveTable[idx | 0];
        const v1 = waveTable[(idx | 0) + 1];

        output[writeIndex++] = v0 + (idx % 1) * (v1 - v0);
        phase += frequencyToPhaseIncr * computedFrequency;
      }
    }

    this._phase = phase;

    return writeIndex;
  },
};

const DefaultPeriodicWaves = {};
const allowedOscillatorTypes = [SINE, SAWTOOTH, TRIANGLE, SQUARE];

const DEFAULT_TYPE$1 = SINE;
const DEFAULT_FREQUENCY$1 = 440;
const DEFAULT_DETUNE$2 = 0;

class OscillatorNode extends AudioScheduledSourceNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {string}       opts.type
   * @param {number}       opts.frequency
   * @param {number}       opts.detune
   */
  constructor(context, opts = {}) {
    const type = defaults(opts.type, DEFAULT_TYPE$1);
    const frequency = defaults(opts.frequency, DEFAULT_FREQUENCY$1);
    const detune = defaults(opts.detune, DEFAULT_DETUNE$2);

    super(context, opts);

    this._frequency = this.addParam(AUDIO_RATE, frequency);
    this._detune = this.addParam(AUDIO_RATE, detune);
    this._type = type;
    this._periodicWave = this.buildPeriodicWave(this._type);
    this._waveTable = null;

    this.dspInit();
  }

  /**
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * @param {string} value
   */
  setType(value) {
    /* istanbul ignore else */
    if (allowedOscillatorTypes.indexOf(value) !== -1) {
      this._type = value;
      this._periodicWave = this.buildPeriodicWave(value);
      this._waveTable = this._periodicWave.getWaveTable();
    }
  }

  /**
   * @param {AudioParam}
   */
  getFrequency() {
    return this._frequency;
  }

  /**
   * @param {AudioParam}
   */
  getDetune() {
    return this._detune;
  }

  /**
   * @param {PeriodicWave} periodicWave
   */
  setPeriodicWave(periodicWave) {
    periodicWave = toImpl(periodicWave);

    /* istanbul ignore else */
    if (periodicWave instanceof PeriodicWave) {
      this._type = CUSTOM;
      this._periodicWave = periodicWave;
      this._waveTable = this._periodicWave.getWaveTable();
    }
  }

  /**
   * @return {PeriodicWave}
   */
  getPeriodicWave() {
    return this._periodicWave;
  }

  /**
   * @param {string} type
   * @return {PeriodicWave}
   */
  buildPeriodicWave(type) {
    const sampleRate = this.context.sampleRate;
    const key = type + ':' + sampleRate;

    /* istanbul ignore else */
    if (!DefaultPeriodicWaves[key]) {
      const periodicWave = new PeriodicWave(
        { sampleRate },
        { constraints: false },
      );

      periodicWave.generateBasicWaveform(type);

      DefaultPeriodicWaves[key] = periodicWave;
    }

    return DefaultPeriodicWaves[key];
  }
}

Object.assign(OscillatorNode.prototype, OscillatorNodeDSP);

const PanningModelTypes = ['equalpower', 'HRTF'];
const DistanceModelTypes = ['linear', 'inverse', 'exponential'];

const DEFAULT_PANNING_MODEL = 'equalpower';
const DEFAULT_DISTANCE_MODEL = 'inverse';
const DEFAULT_REF_DISTANCE = 1;
const DEFAULT_MAX_DISTANCE = 10000;
const DEFAULT_ROLLOFF_FACTOR = 1;
const DEFAULT_CONE_INNER_ANGLE = 360;
const DEFAULT_CONE_OUTER_ANGLE = 360;
const DEFAULT_CONE_OUTER_GAIN = 0;

class BasePannerNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {string}       opts.panningModel
   * @param {string}       opts.distanceModel
   * @param {number}       opts.refDistance
   * @param {number}       opts.maxDistance
   * @param {number}       opts.rolloffFactor
   * @param {number}       opts.coneInnerAngle
   * @param {number}       opts.coneOuterAngle
   * @param {number}       opts.coneOuterGain
   */
  constructor(context, opts = {}) {
    const panningModel = defaults(opts.panningModel, DEFAULT_PANNING_MODEL);
    const distanceModel = defaults(opts.distanceModel, DEFAULT_DISTANCE_MODEL);
    const refDistance = defaults(opts.refDistance, DEFAULT_REF_DISTANCE);
    const maxDistance = defaults(opts.maxDistance, DEFAULT_MAX_DISTANCE);
    const rolloffFactor = defaults(opts.rolloffFactor, DEFAULT_ROLLOFF_FACTOR);
    const coneInnerAngle = defaults(
      opts.coneInnerAngle,
      DEFAULT_CONE_INNER_ANGLE,
    );
    const coneOuterAngle = defaults(
      opts.coneOuterAngle,
      DEFAULT_CONE_OUTER_ANGLE,
    );
    const coneOuterGain = defaults(opts.coneOuterGain, DEFAULT_CONE_OUTER_GAIN);

    super(context, opts, {
      inputs: [1],
      outputs: [2],
      channelCount: 2,
      channelCountMode: CLAMPED_MAX,
      allowedMaxChannelCount: 2,
      allowedChannelCountMode: [CLAMPED_MAX, EXPLICIT],
    });

    this._panningModel = panningModel;
    this._distanceModel = distanceModel;
    this._refDistance = refDistance;
    this._maxDistance = maxDistance;
    this._rolloffFactor = rolloffFactor;
    this._coneInnerAngle = coneInnerAngle;
    this._coneOuterAngle = coneOuterAngle;
    this._coneOuterGain = coneOuterGain;
  }

  /**
   * @return {string}
   */
  getPanningModel() {
    return this._panningModel;
  }

  /**
   * @param {string} value
   */
  setPanningModel(value) {
    /* istanbul ignore else */
    if (PanningModelTypes.indexOf(value) !== -1) {
      this._panningModel = value;
    }
  }

  /**
   * @return {string}
   */
  getDistanceModel() {
    return this._distanceModel;
  }

  /**
   * @param {string} value
   */
  setDistanceModel(value) {
    /* istanbul ignore else */
    if (DistanceModelTypes.indexOf(value) !== -1) {
      this._distanceModel = value;
    }
  }

  /**
   * @return {number}
   */
  getRefDistance() {
    return this._refDistance;
  }

  /**
   * @param {number} value
   */
  setRefDistance(value) {
    this._refDistance = toNumber(value);
  }

  /**
   * @return {number}
   */
  getMaxDistance() {
    return this._maxDistance;
  }

  /**
   * @param {number} value
   */
  setMaxDistance(value) {
    this._maxDistance = toNumber(value);
  }

  /**
   * @return {number}
   */
  getRolloffFactor() {
    return this._rolloffFactor;
  }

  /**
   * @param {number} value
   */
  setRolloffFactor(value) {
    this._rolloffFactor = toNumber(value);
  }

  /**
   * @return {number}
   */
  getConeInnerAngle() {
    return this._coneInnerAngle;
  }

  /**
   * @param {number} value
   */
  setConeInnerAngle(value) {
    this._coneInnerAngle = toNumber(value);
  }

  /**
   * @return {number}
   */
  getConeOuterAngle() {
    return this._coneOuterAngle;
  }

  /**
   * @param {number} value
   */
  setConeOuterAngle(value) {
    this._coneOuterAngle = toNumber(value);
  }

  /**
   * @return {number}
   */
  getConeOuterGain() {
    return this._coneOuterGain;
  }

  /**
   * @param {number} value
   */
  setConeOuterGain(value) {
    this._coneOuterGain = toNumber(value);
  }
}

const PannerNodeDSP = {
  dspProcess() {
    const outputBus = this.outputs[0].bus;

    outputBus.zeros();
    outputBus.sumFrom(this.inputs[0].bus);
  },
};

class PannerNode extends BasePannerNode {
  /**
   * @param {AudioContext} context
   */
  constructor(context, opts) {
    super(context, opts);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setPosition() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setOrientation() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setVelocity() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }
}

Object.assign(PannerNode.prototype, PannerNodeDSP);

const ScriptProcessorNodeDSP = {
  dspInit() {
    this._eventItem = null;
    this._inputChannelData = null;
    this._outputChannelData = null;
    this._writeIndex = 0;
  },

  dspSetEventItem(eventItem) {
    const numberOfInputChannels = this.inputs[0].getNumberOfChannels();
    const numberOfOutputChannels = this.outputs[0].getNumberOfChannels();
    const inputBuffer = new AudioBuffer({
      numberOfChannels: numberOfInputChannels,
      length: this._bufferSize,
      sampleRate: this.sampleRate,
    });
    const outputBuffer = new AudioBuffer({
      numberOfChannels: numberOfOutputChannels,
      length: this._bufferSize,
      sampleRate: this.sampleRate,
    });

    eventItem.inputBuffer._impl = inputBuffer;
    eventItem.outputBuffer._impl = outputBuffer;

    this._inputChannelData = inputBuffer.audioData.channelData;
    this._outputChannelData = outputBuffer.audioData.channelData;

    this._eventItem = eventItem;
  },

  dspProcess() {
    const blockSize = this.blockSize;
    const quantumStartFrame = this.context.currentSampleFrame;
    const quantumEndFrame = quantumStartFrame + blockSize;
    const inputs = this.inputs[0].bus.getChannelData();
    const outputs = this.outputs[0].bus.getMutableData();
    const inputChannelData = this._inputChannelData;
    const outputChannelData = this._outputChannelData;
    const numberOfInputChannels = inputs.length;
    const numberOfOutputChannels = outputs.length;
    const copyFrom = this._writeIndex;
    const copyTo = copyFrom + blockSize;

    for (let ch = 0; ch < numberOfInputChannels; ch++) {
      inputChannelData[ch].set(inputs[ch], copyFrom);
    }
    for (let ch = 0; ch < numberOfOutputChannels; ch++) {
      outputs[ch].set(outputChannelData[ch].subarray(copyFrom, copyTo));
    }

    this._writeIndex += blockSize;

    if (this._writeIndex === this._bufferSize) {
      const playbackTime = quantumEndFrame / this.sampleRate;

      this.context.addPostProcess(() => {
        for (let ch = 0; ch < numberOfOutputChannels; ch++) {
          fill(outputChannelData[ch], 0);
        }
        this._eventItem.playbackTime = playbackTime;
        this.dispatchEvent(this._eventItem);
      });
      this._writeIndex = 0;
    }
  },
};

const DEFAULT_BUFFER_SIZE = 1024;
const DEFAULT_NUMBER_OF_INPUT_CHANNELS = 1;
const DEFAULT_NUMBER_OF_OUTPUT_CHANNELS = 1;
const MIN_BUFFER_SIZE = 256;
const MAX_BUFFER_SIZE = 16384;

class ScriptProcessorNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.bufferSize
   * @param {number}       opts.numberOfInputChannels
   * @param {number}       opts.numberOfOutputChannels
   */
  constructor(context, opts = {}) {
    let bufferSize = defaults(opts.bufferSize, DEFAULT_BUFFER_SIZE);
    let numberOfInputChannels = defaults(
      opts.numberOfInputChannels,
      DEFAULT_NUMBER_OF_INPUT_CHANNELS,
    );
    let numberOfOutputChannels = defaults(
      opts.numberOfOutputChannels,
      DEFAULT_NUMBER_OF_OUTPUT_CHANNELS,
    );

    bufferSize = clamp(bufferSize | 0, MIN_BUFFER_SIZE, MAX_BUFFER_SIZE);
    bufferSize = toPowerOfTwo(bufferSize, Math.ceil);
    numberOfInputChannels = toValidNumberOfChannels(numberOfInputChannels);
    numberOfOutputChannels = toValidNumberOfChannels(numberOfOutputChannels);

    super(context, opts, {
      inputs: [numberOfInputChannels],
      outputs: [numberOfOutputChannels],
      channelCount: numberOfInputChannels,
      channelCountMode: EXPLICIT,
      allowedMaxChannelCount: numberOfInputChannels,
      allowedMinChannelCount: numberOfInputChannels,
      allowedChannelCountMode: [EXPLICIT],
    });

    this._bufferSize = bufferSize;

    this.enableOutputsIfNecessary();
    this.dspInit();
  }

  /**
   * @return {number}
   */
  getBufferSize() {
    return this._bufferSize;
  }

  /**
   * @return {object} eventItem
   */
  setEventItem(eventItem) {
    this.dspSetEventItem(eventItem);
  }

  /**
   * @return {number}
   */
  getTailTime() {
    return Infinity;
  }
}

Object.assign(ScriptProcessorNode.prototype, ScriptProcessorNodeDSP);

const SpatialPannerNodeDSP = {
  dspProcess() {
    const outputBus = this.outputs[0].bus;

    outputBus.zeros();
    outputBus.sumFrom(this.inputs[0].bus);
  },
};

class SpatialPannerNode extends BasePannerNode {
  /**
   * @param {AudioContext}
   */
  constructor(context, opts) {
    super(context, opts);

    this._positionX = this.addParam(AUDIO_RATE, 0);
    this._positionY = this.addParam(AUDIO_RATE, 0);
    this._positionZ = this.addParam(AUDIO_RATE, 0);
    this._orientationX = this.addParam(AUDIO_RATE, 0);
    this._orientationY = this.addParam(AUDIO_RATE, 0);
    this._orientationZ = this.addParam(AUDIO_RATE, 0);
  }

  /**
   * @param {AudioParam}
   */
  getPositionX() {
    return this._positionX;
  }

  /**
   * @param {AudioParam}
   */
  getPositionY() {
    return this._positionY;
  }

  /**
   * @param {AudioParam}
   */
  getPositionZ() {
    return this._positionZ;
  }

  /**
   * @param {AudioParam}
   */
  getOrientationX() {
    return this._positionX;
  }

  /**
   * @param {AudioParam}
   */
  getOrientationY() {
    return this._positionY;
  }

  /**
   * @param {AudioParam}
   */
  getOrientationZ() {
    return this._positionZ;
  }
}

Object.assign(SpatialPannerNode.prototype, SpatialPannerNodeDSP);

const StereoPannerNodeDSP = {
  dspProcess() {
    const inputBus = this.inputs[0].bus;
    const outputBus = this.outputs[0].bus;

    if (inputBus.isSilent) {
      outputBus.zeros();
      return;
    }

    const panParam = this._pan;

    if (panParam.hasSampleAccurateValues()) {
      this.dspSampleAccurateValues(
        inputBus,
        outputBus,
        panParam.getSampleAccurateValues(),
        this.blockSize,
      );
    } else {
      this.dspStaticValue(
        inputBus,
        outputBus,
        panParam.getValue(),
        this.blockSize,
      );
    }
  },

  dspSampleAccurateValues(inputBus, outputBus, panValues, blockSize) {
    const outputs = outputBus.getMutableData();
    const numberOfChannels = inputBus.getNumberOfChannels();

    if (numberOfChannels === 1) {
      const input = inputBus.getChannelData()[0];

      for (let i = 0; i < blockSize; i++) {
        const panValue = Math.max(-1, Math.min(panValues[i], +1));
        const panRadian = (panValue * 0.5 + 0.5) * 0.5 * Math.PI;
        const gainL = Math.cos(panRadian);
        const gainR = Math.sin(panRadian);

        outputs[0][i] = input[i] * gainL;
        outputs[1][i] = input[i] * gainR;
      }
    } else {
      const inputs = inputBus.getChannelData();

      for (let i = 0; i < blockSize; i++) {
        const panValue = Math.max(-1, Math.min(panValues[i], +1));
        const panRadian =
          (panValue <= 0 ? panValue + 1 : panValue) * 0.5 * Math.PI;
        const gainL = Math.cos(panRadian);
        const gainR = Math.sin(panRadian);

        if (panValue <= 0) {
          outputs[0][i] = inputs[0][i] + inputs[1][i] * gainL;
          outputs[1][i] = inputs[1][i] * gainR;
        } else {
          outputs[0][i] = inputs[0][i] * gainL;
          outputs[1][i] = inputs[1][i] + inputs[0][i] * gainR;
        }
      }
    }
  },

  dspStaticValue(inputBus, outputBus, panValue, blockSize) {
    const outputs = outputBus.getMutableData();
    const numberOfChannels = inputBus.getNumberOfChannels();

    panValue = Math.max(-1, Math.min(panValue, +1));

    if (numberOfChannels === 1) {
      const input = inputBus.getChannelData()[0];
      const panRadian = (panValue * 0.5 + 0.5) * 0.5 * Math.PI;
      const gainL = Math.cos(panRadian);
      const gainR = Math.sin(panRadian);

      for (let i = 0; i < blockSize; i++) {
        outputs[0][i] = input[i] * gainL;
        outputs[1][i] = input[i] * gainR;
      }
    } else {
      const inputs = inputBus.getChannelData();
      const panRadian =
        (panValue <= 0 ? panValue + 1 : panValue) * 0.5 * Math.PI;
      const gainL = Math.cos(panRadian);
      const gainR = Math.sin(panRadian);

      if (panValue <= 0) {
        for (let i = 0; i < blockSize; i++) {
          outputs[0][i] = inputs[0][i] + inputs[1][i] * gainL;
          outputs[1][i] = inputs[1][i] * gainR;
        }
      } else {
        for (let i = 0; i < blockSize; i++) {
          outputs[0][i] = inputs[0][i] * gainL;
          outputs[1][i] = inputs[1][i] + inputs[0][i] * gainR;
        }
      }
    }
  },
};

const DEFAULT_PAN = 0;

class StereoPannerNode extends BasePannerNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.pan
   */
  constructor(context, opts = {}) {
    const pan = defaults(opts.pan, DEFAULT_PAN);

    super(context, opts);

    this._pan = this.addParam(AUDIO_RATE, pan);
  }

  /**
   * @param {AudioParam}
   */
  getPan() {
    return this._pan;
  }
}

Object.assign(StereoPannerNode.prototype, StereoPannerNodeDSP);

const WaveShaperNodeDSP = {
  dspInit() {
    this._kernels = [];
  },

  dspUpdateKernel(curve, numberOfChannels) {
    if (curve === null) {
      numberOfChannels = 0;
    }
    if (numberOfChannels < this._kernels.length) {
      this._kernels.splice(numberOfChannels);
    } else if (this._kernels.length < numberOfChannels) {
      while (numberOfChannels !== this._kernels.length) {
        this._kernels.push(new WaveShaperKernel(this, this._kernels.length));
      }
    }

    assert(numberOfChannels === this._kernels.length);

    switch (numberOfChannels) {
      case 0:
        this.dspProcess = this.dspProcess0;
        break;
      case 1:
        this.dspProcess = this.dspProcess1;
        break;
      case 2:
        this.dspProcess = this.dspProcess2;
        break;
      default:
        this.dspProcess = this.dspProcessN;
        break;
    }
  },

  dspProcess0() {
    this.outputs[0].bus.copyFrom(this.inputs[0].bus);
  },

  dspProcess1() {
    const inputBus = this.inputs[0].bus;
    const outputBus = this.outputs[0].bus;
    const inputs = inputBus.getChannelData();
    const outputs = outputBus.getMutableData();
    const kernels = this._kernels;

    kernels[0].process(inputs[0], outputs[0], this._curve, this.blockSize);
  },

  dspProcess2() {
    const inputBus = this.inputs[0].bus;
    const outputBus = this.outputs[0].bus;
    const inputs = inputBus.getChannelData();
    const outputs = outputBus.getMutableData();
    const blockSize = this.blockSize;
    const curve = this._curve;
    const kernels = this._kernels;

    kernels[0].process(inputs[0], outputs[0], curve, blockSize);
    kernels[1].process(inputs[1], outputs[1], curve, blockSize);
  },

  dspProcessN() {
    const inputBus = this.inputs[0].bus;
    const outputBus = this.outputs[0].bus;
    const inputs = inputBus.getChannelData();
    const outputs = outputBus.getMutableData();
    const blockSize = this.blockSize;
    const curve = this._curve;
    const kernels = this._kernels;

    for (let i = 0, imax = kernels.length; i < imax; i++) {
      kernels[i].process(inputs[i], outputs[i], curve, blockSize);
    }
  },
};

class WaveShaperKernel {
  process(input, output, curve, inNumSamples) {
    for (let i = 0; i < inNumSamples; i++) {
      const x = (Math.max(-1, Math.min(input[i], 1)) + 1) * 0.5;
      const ix = x * (curve.length - 1);
      const i0 = ix | 0;
      const i1 = i0 + 1;

      if (curve.length <= i1) {
        output[i] = curve[curve.length - 1];
      } else {
        output[i] = curve[i0] + (ix % 1) * (curve[i1] - curve[i0]);
      }
    }
  }
}

const OverSampleTypes = ['none', '2x', '4x'];

const DEFAULT_CURVE = null;
const DEFAULT_OVERSAMPLE = 'none';

class WaveShaperNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {Float32Arrat} opts.curve
   * @param {string}       opts.overSample
   */
  constructor(context, opts = {}) {
    const curve = defaults(opts.curve, DEFAULT_CURVE);
    const overSample = defaults(opts.overSample, DEFAULT_OVERSAMPLE);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._curve = curve;
    this._overSample = overSample;

    this.dspInit();
    this.dspUpdateKernel(null, 1);
  }

  /**
   * @return {Float32Array}
   */
  getCurve() {
    return this._curve;
  }

  /**
   * @param {Float32Array} value
   */
  setCurve(value) {
    /* istanbul ignore else */
    if (value === null || value instanceof Float32Array) {
      this._curve = value;
      this.dspUpdateKernel(this._curve, this.outputs[0].getNumberOfChannels());
    }
  }

  /**
   * @return {boolean}
   */
  getOversample() {
    return this._overSample;
  }

  /**
   * @param {boolean} value
   */
  setOversample(value) {
    /* istanbul ignore else */
    if (OverSampleTypes.indexOf(value) !== -1) {
      this._overSample = value;
    }
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.dspUpdateKernel(this._curve, numberOfChannels);
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }
}

Object.assign(WaveShaperNode.prototype, WaveShaperNodeDSP);

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AnalyserNode: AnalyserNode,
  AudioBuffer: AudioBuffer,
  AudioBufferSourceNode: AudioBufferSourceNode,
  AudioContext: AudioContext,
  AudioDestinationNode: AudioDestinationNode,
  AudioListener: AudioListener,
  AudioNode: AudioNode,
  AudioParam: AudioParam,
  BiquadFilterNode: BiquadFilterNode,
  ChannelMergerNode: ChannelMergerNode,
  ChannelSplitterNode: ChannelSplitterNode,
  ConstantSourceNode: ConstantSourceNode$1,
  ConvolverNode: ConvolverNode,
  DelayNode: DelayNode,
  DynamicsCompressorNode: DynamicsCompressorNode,
  GainNode: GainNode,
  IIRFilterNode: IIRFilterNode,
  OscillatorNode: OscillatorNode,
  PannerNode: PannerNode,
  PeriodicWave: PeriodicWave,
  ScriptProcessorNode: ScriptProcessorNode,
  SpatialPannerNode: SpatialPannerNode,
  StereoPannerNode: StereoPannerNode,
  WaveShaperNode: WaveShaperNode
});

class EventTarget$1 {
  addEventListener(type, listener) {
    this._impl.addEventListener(type, listener);
  }

  removeEventListener(type, listener) {
    this._impl.removeEventListener(type, listener);
  }
}

class AudioNode$1 extends EventTarget$1 {
  constructor(context) {
    super();

    defineProp(this, '_context', context);
    defineProp(this, '_impl', null);
  }

  get context() {
    return this._context;
  }

  get numberOfInputs() {
    return this._impl.getNumberOfInputs();
  }

  get numberOfOutputs() {
    return this._impl.getNumberOfOutputs();
  }

  get channelCount() {
    return this._impl.getChannelCount();
  }

  set channelCount(value) {
    this._impl.setChannelCount(value);
  }

  get channelCountMode() {
    return this._impl.getChannelCountMode();
  }

  set channelCountMode(value) {
    this._impl.setChannelCountMode(value);
  }

  get channelInterpretation() {
    return this._impl.getChannelInterpretation();
  }

  set channelInterpretation(value) {
    return this._impl.setChannelInterpretation(value);
  }

  connect(destination, input, output) {
    this._impl.connect(destination._impl, input, output);

    /* istanbul ignore else */
    if (destination instanceof AudioNode$1) {
      return destination;
    }
  }

  disconnect() {
    this._impl.disconnect.apply(this._impl, arguments);
  }
}

class AudioDestinationNode$1 extends AudioNode$1 {
  constructor(context, impl) {
    super(context);

    this._impl = impl;
  }

  get maxChannelCount() {
    return this._impl.getMaxChannelCount();
  }
}

class AudioListener$1 {
  constructor(context, impl) {
    defineProp(this, '_impl', impl);
  }

  setPosition(x, y, z) {
    this._impl.setPosition(x, y, z);
  }

  setOrientation(x, y, z, xUp, yUp, zUp) {
    this._impl.setOrientation(x, y, z, xUp, yUp, zUp);
  }
}

class AudioBuffer$1 {
  constructor(opts) {
    defineProp(this, '_impl', new AudioBuffer(opts));
  }

  get sampleRate() {
    return this._impl.getSampleRate();
  }

  get length() {
    return this._impl.getLength();
  }

  get duration() {
    return this._impl.getDuration();
  }

  get numberOfChannels() {
    return this._impl.getNumberOfChannels();
  }

  getChannelData(channel) {
    return this._impl.getChannelData(channel);
  }

  copyFromChannel(destination, channelNumber, startInChannel) {
    this._impl.copyFromChannel(destination, channelNumber, startInChannel);
  }

  copyToChannel(source, channelNumber, startInChannel) {
    this._impl.copyToChannel(source, channelNumber, startInChannel);
  }
}

class AudioScheduledSourceNode$1 extends AudioNode$1 {
  get onended() {
    return this._impl.$onended;
  }

  set onended(callback) {
    this._impl.replaceEventListener('ended', this._impl.$onended, callback);
    this._impl.$onended = callback;
  }

  /**
   *
   * @param {number} when
   * @param {number} [offset]
   * @param {number} [duration]
   */
  start(when, offset, duration) {
    this._impl.start(when, offset, duration);
  }

  stop(when) {
    this._impl.stop(when);
  }
}

class AudioParam$1 {
  constructor(context, impl) {
    defineProp(this, '_context', context);
    defineProp(this, '_impl', impl);
  }

  get value() {
    return this._impl.getValue();
  }

  set value(value) {
    this._impl.setValue(value);
  }

  get defaultValue() {
    return this._impl.getDefaultValue();
  }

  setValueAtTime(value, startTime) {
    this._impl.setValueAtTime(value, startTime);
    return this;
  }

  linearRampToValueAtTime(value, endTime) {
    this._impl.linearRampToValueAtTime(value, endTime);
    return this;
  }

  exponentialRampToValueAtTime(value, endTime) {
    this._impl.exponentialRampToValueAtTime(value, endTime);
    return this;
  }

  setTargetAtTime(target, startTime, timeConstant) {
    this._impl.setTargetAtTime(target, startTime, timeConstant);
    return this;
  }

  setValueCurveAtTime(values, startTime, duration) {
    this._impl.setValueCurveAtTime(values, startTime, duration);
    return this;
  }

  cancelScheduledValues(startTime) {
    this._impl.cancelScheduledValues(startTime);
    return this;
  }
}

class AudioBufferSourceNode$1 extends AudioScheduledSourceNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new AudioBufferSourceNode(context._impl, opts);
    this._impl.$playbackRate = new AudioParam$1(
      context,
      this._impl.getPlaybackRate(),
    );
    this._impl.$detune = new AudioParam$1(context, this._impl.getDetune());
    this._impl.$buffer = null;
    this._impl.$onended = null;

    if (opts && opts.buffer) {
      this.buffer = opts.buffer;
    }
  }

  get buffer() {
    return this._impl.$buffer;
  }

  set buffer(value) {
    this._impl.$buffer = value;
    this._impl.setBuffer(value);
  }

  get playbackRate() {
    return this._impl.$playbackRate;
  }

  get detune() {
    return this._impl.$detune;
  }

  get loop() {
    return this._impl.getLoop();
  }

  set loop(value) {
    this._impl.setLoop(value);
  }

  get loopStart() {
    return this._impl.getLoopStart();
  }

  set loopStart(value) {
    this._impl.setLoopStart(value);
  }

  get loopEnd() {
    return this._impl.getLoopEnd();
  }

  set loopEnd(value) {
    this._impl.setLoopEnd(value);
  }

  start(when, offset, duration) {
    this._impl.start(when, offset, duration);
  }
}

class ScriptProcessorNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new ScriptProcessorNode(context._impl, opts);
    this._impl.$onaudioprocess = null;
    this._impl.setEventItem({
      type: 'audioprocess',
      playbackTime: 0,
      inputBuffer: new AudioBuffer$1(),
      outputBuffer: new AudioBuffer$1(),
    });
  }

  get bufferSize() {
    return this._impl.getBufferSize();
  }

  get onaudioprocess() {
    return this._impl.$onaudioprocess;
  }

  set onaudioprocess(callback) {
    this._impl.replaceEventListener(
      'audioprocess',
      this._impl.$onaudioprocess,
      callback,
    );
    this._impl.$onaudioprocess = callback;
  }
}

class AnalyserNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new AnalyserNode(context._impl, opts);
  }

  get fftSize() {
    return this._impl.getFftSize();
  }

  set fftSize(value) {
    this._impl.setFftSize(value);
  }

  get frequencyBinCount() {
    return this._impl.getFrequencyBinCount();
  }

  get minDecibels() {
    return this._impl.getMinDecibels();
  }

  set minDecibels(value) {
    this._impl.setMinDecibels(value);
  }

  get maxDecibels() {
    return this._impl.getMaxDecibels();
  }

  set maxDecibels(value) {
    this._impl.setMaxDecibels(value);
  }

  get smoothingTimeConstant() {
    return this._impl.getSmoothingTimeConstant();
  }

  set smoothingTimeConstant(value) {
    this._impl.setSmoothingTimeConstant(value);
  }

  getFloatFrequencyData(array) {
    this._impl.getFloatFrequencyData(array);
  }

  getByteFrequencyData(array) {
    this._impl.getByteFrequencyData(array);
  }

  getFloatTimeDomainData(array) {
    this._impl.getFloatTimeDomainData(array);
  }

  getByteTimeDomainData(array) {
    this._impl.getByteTimeDomainData(array);
  }
}

class GainNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new GainNode(context._impl, opts);
    this._impl.$gain = new AudioParam$1(context, this._impl.getGain());
  }

  get gain() {
    return this._impl.$gain;
  }
}

class DelayNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new DelayNode(context._impl, opts);
    this._impl.$delayTime = new AudioParam$1(context, this._impl.getDelayTime());
  }

  get delayTime() {
    return this._impl.$delayTime;
  }
}

class BiquadFilterNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new BiquadFilterNode(context._impl, opts);
    this._impl.$frequency = new AudioParam$1(context, this._impl.getFrequency());
    this._impl.$detune = new AudioParam$1(context, this._impl.getDetune());
    this._impl.$Q = new AudioParam$1(context, this._impl.getQ());
    this._impl.$gain = new AudioParam$1(context, this._impl.getGain());
  }

  get type() {
    return this._impl.getType();
  }

  set type(value) {
    this._impl.setType(value);
  }

  get frequency() {
    return this._impl.$frequency;
  }

  get detune() {
    return this._impl.$detune;
  }

  get Q() {
    return this._impl.$Q;
  }

  get gain() {
    return this._impl.$gain;
  }

  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this._impl.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }
}

class IIRFilterNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new IIRFilterNode(context._impl, opts);
  }

  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this._impl.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }
}

class WaveShaperNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new WaveShaperNode(context._impl, opts);
  }

  get curve() {
    return this._impl.getCurve();
  }

  set curve(value) {
    this._impl.setCurve(value);
  }

  get oversample() {
    return this._impl.getOversample();
  }

  set oversample(value) {
    this._impl.setOversample(value);
  }
}

class PannerNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new PannerNode(context._impl, opts);
  }

  get panningModel() {
    return this._impl.getPanningModel();
  }

  set panningModel(value) {
    this._impl.setPanningModel(value);
  }

  get distanceModel() {
    return this._impl.getDistanceModel();
  }

  set distanceModel(value) {
    this._impl.setDistanceModel(value);
  }

  get refDistance() {
    return this._impl.getRefDistance();
  }

  set refDistance(value) {
    this._impl.setRefDistance(value);
  }

  get maxDistance() {
    return this._impl.getMaxDistance();
  }

  set maxDistance(value) {
    this._impl.setMaxDistance(value);
  }

  get rolloffFactor() {
    return this._impl.getRolloffFactor();
  }

  set rolloffFactor(value) {
    this._impl.setRolloffFactor(value);
  }

  get coneInnerAngle() {
    return this._impl.getConeInnerAngle();
  }

  set coneInnerAngle(value) {
    this._impl.setConeInnerAngle(value);
  }

  get coneOuterAngle() {
    return this._impl.getConeOuterAngle();
  }

  set coneOuterAngle(value) {
    this._impl.setConeOuterAngle(value);
  }

  get coneOuterGain() {
    return this._impl.getConeOuterGain();
  }

  set coneOuterGain(value) {
    this._impl.setConeOuterGain(value);
  }

  setPosition(x, y, z) {
    this._impl.setPosition(x, y, z);
  }

  setOrientation(x, y, z) {
    this._impl.setOrientation(x, y, z);
  }

  setVelocity(x, y, z) {
    this._impl.setVelocity(x, y, z);
  }
}

class SpatialPannerNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new SpatialPannerNode(context._impl, opts);
    this._impl.$positionX = new AudioParam$1(context, this._impl.getPositionX());
    this._impl.$positionY = new AudioParam$1(context, this._impl.getPositionY());
    this._impl.$positionZ = new AudioParam$1(context, this._impl.getPositionZ());
    this._impl.$orientationX = new AudioParam$1(
      context,
      this._impl.getOrientationX(),
    );
    this._impl.$orientationY = new AudioParam$1(
      context,
      this._impl.getOrientationY(),
    );
    this._impl.$orientationZ = new AudioParam$1(
      context,
      this._impl.getOrientationZ(),
    );
  }

  get panningModel() {
    return this._impl.getPanningModel();
  }

  set panningModel(value) {
    this._impl.setPanningModel(value);
  }

  get positionX() {
    return this._impl.$positionX;
  }

  get positionY() {
    return this._impl.$positionY;
  }

  get positionZ() {
    return this._impl.$positionZ;
  }

  get orientationX() {
    return this._impl.$orientationX;
  }

  get orientationY() {
    return this._impl.$orientationY;
  }

  get orientationZ() {
    return this._impl.$orientationZ;
  }

  get distanceModel() {
    return this._impl.getDistanceModel();
  }

  set distanceModel(value) {
    this._impl.setDistanceModel(value);
  }

  get refDistance() {
    return this._impl.getRefDistance();
  }

  set refDistance(value) {
    this._impl.setRefDistance(value);
  }

  get maxDistance() {
    return this._impl.getMaxDistance();
  }

  set maxDistance(value) {
    this._impl.setMaxDistance(value);
  }

  get rolloffFactor() {
    return this._impl.getRolloffFactor();
  }

  set rolloffFactor(value) {
    this._impl.setRolloffFactor(value);
  }

  get coneInnerAngle() {
    return this._impl.getConeInnerAngle();
  }

  set coneInnerAngle(value) {
    this._impl.setConeInnerAngle(value);
  }

  get coneOuterAngle() {
    return this._impl.getConeOuterAngle();
  }

  set coneOuterAngle(value) {
    this._impl.setConeOuterAngle(value);
  }

  get coneOuterGain() {
    return this._impl.getConeOuterGain();
  }

  set coneOuterGain(value) {
    this._impl.setConeOuterGain(value);
  }
}

class StereoPannerNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new StereoPannerNode(context._impl, opts);
    this._impl.$pan = new AudioParam$1(context, this._impl.getPan());
  }

  get pan() {
    return this._impl.$pan;
  }
}

class ConvolverNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new ConvolverNode(context._impl, opts);
    this._impl.$buffer = null;

    if (opts && opts.buffer) {
      this.buffer = opts.buffer;
    }
  }

  get buffer() {
    return this._impl.$buffer;
  }

  set buffer(value) {
    this._impl.$buffer = value;
    this._impl.setBuffer(value);
  }

  get normalize() {
    return this._impl.getNormalize();
  }

  set normalize(value) {
    this._impl.setNormalize(value);
  }
}

class ConstantSourceNode$2 extends AudioScheduledSourceNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new ConstantSourceNode$1(context._impl, opts);
    this._impl.$offset = new AudioParam$1(context, this._impl.getOffset());
    this._impl.$onended = null;
  }

  get offset() {
    return this._impl.$offset;
  }
}

class ChannelSplitterNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new ChannelSplitterNode(context._impl, opts);
  }
}

class ChannelMergerNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new ChannelMergerNode(context._impl, opts);
  }
}

class DynamicsCompressorNode$1 extends AudioNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new DynamicsCompressorNode(context._impl, opts);
    this._impl.$threshold = new AudioParam$1(context, this._impl.getThreshold());
    this._impl.$knee = new AudioParam$1(context, this._impl.getKnee());
    this._impl.$ratio = new AudioParam$1(context, this._impl.getRatio());
    this._impl.$attack = new AudioParam$1(context, this._impl.getAttack());
    this._impl.$release = new AudioParam$1(context, this._impl.getRelease());
  }

  get threshold() {
    return this._impl.$threshold;
  }

  get knee() {
    return this._impl.$knee;
  }

  get ratio() {
    return this._impl.$ratio;
  }

  get reduction() {
    return this._impl.getReduction();
  }

  get attack() {
    return this._impl.$attack;
  }

  get release() {
    return this._impl.$release;
  }
}

class OscillatorNode$1 extends AudioScheduledSourceNode$1 {
  constructor(context, opts) {
    super(context);

    this._impl = new OscillatorNode(context._impl, opts);
    this._impl.$frequency = new AudioParam$1(context, this._impl.getFrequency());
    this._impl.$detune = new AudioParam$1(context, this._impl.getDetune());
    this._impl.$onended = null;

    if (opts && opts.periodicWave) {
      this.setPeriodicWave(opts.periodicWave);
    }
  }

  get type() {
    return this._impl.getType();
  }

  set type(value) {
    this._impl.setType(value);
  }

  get frequency() {
    return this._impl.$frequency;
  }

  get detune() {
    return this._impl.$detune;
  }

  setPeriodicWave(periodicWave) {
    this._impl.setPeriodicWave(periodicWave);
  }
}

class PeriodicWave$1 {
  constructor(context, opts) {
    defineProp(this, '_impl', new PeriodicWave(context._impl, opts));
  }
}

/**
 * @param {function}    decodeFn
 * @param {ArrayBuffer} audioData
 * @param {object}      opts
 * @return {Promise<AudioData>}
 */
function decode(decodeFn, audioData, /* istanbul ignore next */ opts = {}) {
  return new Promise((resolve, reject) => {
    return decodeFn(audioData, opts).then((result) => {
      if (isAudioData(result)) {
        if (typeof opts.sampleRate === 'number') {
          result = resample(result, opts.sampleRate);
        }
        return resolve(result);
      }
      return reject(new TypeError('Failed to decode audio data'));
    }, reject);
  });
}

/**
 * @param {AudioData} audioData
 * @param {number}    sampleRate
 */
function resample(audioData, sampleRate) {
  if (audioData.sampleRate === sampleRate) {
    return audioData;
  }

  const rate = audioData.sampleRate / sampleRate;
  const numberOfChannels = audioData.channelData.length;
  const length = Math.round(audioData.channelData[0].length / rate);
  const channelData = nmap(numberOfChannels, () => new Float32Array(length));

  for (let i = 0; i < length; i++) {
    const ix = i * rate;
    const i0 = ix | 0;
    const i1 = i0 + 1;
    const ia = ix % 1;

    for (let ch = 0; ch < numberOfChannels; ch++) {
      const v0 = audioData.channelData[ch][i0];
      const v1 = audioData.channelData[ch][i1];

      channelData[ch][i] = v0 + ia * (v1 - v0);
    }
  }

  return { numberOfChannels, length, sampleRate, channelData };
}

const decoders = {};

/**
 * @param {string}    type
 * @return {function}
 */
function get(type) {
  return decoders[type] || null;
}

/**
 * @param {string}   type
 * @param {function} fn
 */
function set(type, fn) {
  /* istanbul ignore else */
  if (typeof fn === 'function') {
    decoders[type] = fn;
  }
}

/**
 * @param {ArrayBuffer} AudioBuffer
 * @param {object}      opts
 * @return {Promise<AudioData>}
 */
function decode$1(audioData, opts) {
  const type = toAudioType(audioData);
  const decodeFn = decoders[type];

  if (typeof decodeFn !== 'function') {
    return Promise.reject(
      new TypeError(
        `Decoder does not support the audio format: ${type || 'unknown'}`,
      ),
    );
  }

  return decode(decodeFn, audioData, opts).then((audioData) => {
    return toAudioBuffer(audioData, AudioBuffer$1);
  });
}

function toAudioType(audioData) {
  if (!(audioData instanceof Uint8Array)) {
    audioData = new Uint8Array(audioData, 0, 16);
  }
  return audioType(audioData) || '';
}

set('wav', WavDecoder.decode);

var decoder = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get,
  set: set,
  decode: decode$1
});

class BaseAudioContext extends EventTarget$1 {
  constructor(opts) {
    super();

    defineProp(this, '_impl', new AudioContext(opts));

    this._impl.$destination = new AudioDestinationNode$1(
      this,
      this._impl.getDestination(),
    );
    this._impl.$listener = new AudioListener$1(this, this._impl.getListener());
    this._impl.$onstatechange = null;
  }

  get destination() {
    return this._impl.$destination;
  }

  get sampleRate() {
    return this._impl.getSampleRate();
  }

  get currentTime() {
    return this._impl.getCurrentTime();
  }

  get listener() {
    return this._impl.$listener;
  }

  get state() {
    return this._impl.getState();
  }

  resume() {
    return this._impl.resume();
  }

  close() {
    return this._impl.close();
  }

  get onstatechange() {
    return this._impl.$onstatechange;
  }

  set onstatechange(callback) {
    this._impl.replaceEventListener(
      'statechange',
      this._impl.$onstatechange,
      callback,
    );
    this._impl.$onstatechange = callback;
  }

  createBuffer(numberOfChannels, length, sampleRate) {
    return new AudioBuffer$1({ numberOfChannels, length, sampleRate });
  }

  decodeAudioData(
    audioData,
    successCallback = undefined,
    errorCallback = undefined,
  ) {
    const promise = decode$1(audioData, { sampleRate: this.sampleRate });

    promise.then(successCallback, errorCallback);

    return promise;
  }

  createBufferSource() {
    return new AudioBufferSourceNode$1(this);
  }

  createConstantSource() {
    return new ConstantSourceNode$2(this);
  }

  createScriptProcessor(
    bufferSize,
    numberOfInputChannels,
    numberOfOutputChannels,
  ) {
    return new ScriptProcessorNode$1(this, {
      bufferSize,
      numberOfInputChannels,
      numberOfOutputChannels,
    });
  }

  createAnalyser() {
    return new AnalyserNode$1(this);
  }

  createGain() {
    return new GainNode$1(this);
  }

  createDelay(maxDelayTime) {
    return new DelayNode$1(this, { maxDelayTime });
  }

  createBiquadFilter() {
    return new BiquadFilterNode$1(this);
  }

  createIIRFilter(feedforward, feedback) {
    return new IIRFilterNode$1(this, { feedforward, feedback });
  }

  createWaveShaper() {
    return new WaveShaperNode$1(this);
  }

  createPanner() {
    return new PannerNode$1(this);
  }

  createSpatialPanner() {
    return new SpatialPannerNode$1(this);
  }

  createStereoPanner() {
    return new StereoPannerNode$1(this);
  }

  createConvolver() {
    return new ConvolverNode$1(this);
  }

  createChannelSplitter(numberOfOutputs) {
    return new ChannelSplitterNode$1(this, { numberOfOutputs });
  }

  createChannelMerger(numberOfInputs) {
    return new ChannelMergerNode$1(this, { numberOfInputs });
  }

  createDynamicsCompressor() {
    return new DynamicsCompressorNode$1(this);
  }

  createOscillator() {
    return new OscillatorNode$1(this);
  }

  createPeriodicWave(real, imag, constraints) {
    return new PeriodicWave$1(this, { real, imag, constraints });
  }
}

var setImmediate = global.setImmediate /* istanbul ignore next */ ||
  ((fn) => setTimeout(fn, 0));

class OfflineAudioContext extends BaseAudioContext {
  /**
   * @param {number} numberOfChannels
   * @param {number} length
   * @param {number} sampleRate
   */
  constructor(numberOfChannels, length, sampleRate) {
    numberOfChannels = toValidNumberOfChannels(numberOfChannels);
    length = Math.max(0, length | 0);
    sampleRate = toValidSampleRate(sampleRate);

    super({ sampleRate, numberOfChannels });

    this._impl.$oncomplete = null;

    defineProp(this, '_numberOfChannels', numberOfChannels);
    defineProp(this, '_length', length);
    defineProp(this, '_suspendedTime', Infinity);
    defineProp(this, '_suspendPromise', null);
    defineProp(this, '_suspendResolve', null);
    defineProp(this, '_renderingPromise', null);
    defineProp(this, '_renderingResolve', null);
    defineProp(this, '_renderingIterations', 128);
    defineProp(this, '_audioData', null);
    defineProp(this, '_writeIndex', 0);
  }

  /**
   * @return {number}
   */
  get length() {
    return this._length;
  }

  /**
   * @return {function}
   */
  get oncomplete() {
    return this._impl.$oncomplete;
  }

  /**
   * @param {function} callback
   */
  set oncomplete(callback) {
    this._impl.replaceEventListener(
      'complete',
      this._impl.$oncomplete,
      callback,
    );
    this._impl.$oncomplete = callback;
  }

  /**
   * @return {Promise<void>}
   */
  resume() {
    /* istanbul ignore next */
    if (this._impl.state === CLOSED) {
      return Promise.reject(
        new TypeError(
          'cannot startRendering when an OfflineAudioContext is closed',
        ),
      );
    }
    /* istanbul ignore next */
    if (this._renderingPromise === null) {
      return Promise.reject(
        new TypeError('cannot resume an offline context that has not started'),
      );
    }
    /* istanbul ignore else */
    if (this._impl.state === SUSPENDED) {
      render.call(this, this._impl);
    }
    return Promise.resolve();
  }

  /**
   * @param {number} time
   * @return {Promise<void>}
   */
  suspend(time) {
    /* istanbul ignore next */
    if (this._impl.state === CLOSED) {
      return Promise.reject(
        new TypeError(
          'cannot startRendering when an OfflineAudioContext is closed',
        ),
      );
    }
    /* istanbul ignore next */
    if (this._suspendPromise !== null) {
      return Promise.reject(
        new TypeError('cannot schedule more than one suspend'),
      );
    }

    time = Math.max(0, toNumber(time));

    this._suspendedTime = time;
    this._suspendPromise = new Promise((resolve) => {
      this._suspendResolve = resolve;
    });

    return this._suspendPromise;
  }

  /**
   * @return {Promise<void>}
   */
  /* istanbul ignore next */
  close() {
    return Promise.reject(new TypeError('cannot close an OfflineAudioContext'));
  }

  /**
   * @return {Promise<AudioBuffer>}
   */
  startRendering() {
    /* istanbul ignore next */
    if (this._impl.state === CLOSED) {
      return Promise.reject(
        new TypeError(
          'cannot startRendering when an OfflineAudioContext is closed',
        ),
      );
    }
    /* istanbul ignore next */
    if (this._renderingPromise !== null) {
      return Promise.reject(
        new TypeError('cannot call startRendering more than once'),
      );
    }

    this._renderingPromise = new Promise((resolve) => {
      const numberOfChannels = this._numberOfChannels;
      const length = this._length;
      const sampleRate = this.sampleRate;
      const blockSize = this._impl.blockSize;

      this._audioData = createRenderingAudioData(
        numberOfChannels,
        length,
        sampleRate,
        blockSize,
      );
      this._renderingResolve = resolve;

      render.call(this, this._impl);
    });

    return this._renderingPromise;
  }
}

function createRenderingAudioData(
  numberOfChannels,
  length,
  sampleRate,
  blockSize,
) {
  length = Math.ceil(length / blockSize) * blockSize;

  const channelData = nmap(numberOfChannels, () => new Float32Array(length));

  return { numberOfChannels, length, sampleRate, channelData };
}

function suspendRendering() {
  this._suspendResolve();
  this._suspendedTime = Infinity;
  this._suspendPromise = this._suspendResolve = null;
  this._impl.changeState(SUSPENDED);
}

function doneRendering(audioData) {
  const length = this._length;

  audioData.channelData = audioData.channelData.map((channelData) => {
    return channelData.subarray(0, length);
  });
  audioData.length = length;

  const audioBuffer = toAudioBuffer(audioData, AudioBuffer$1);

  this._impl.changeState(CLOSED);
  this._impl.dispatchEvent({ type: 'complete', renderedBuffer: audioBuffer });

  this._renderingResolve(audioBuffer);
  this._renderingResolve = null;
}

function render(impl) {
  const audioData = this._audioData;
  const audioDataLength = audioData.length;
  const channelData = audioData.channelData;
  const blockSize = impl.blockSize;
  const renderingIterations = this._renderingIterations;

  let writeIndex = this._writeIndex;

  const loop = () => {
    const remainIterations = (audioDataLength - writeIndex) / blockSize;
    const iterations = Math.min(renderingIterations, remainIterations) | 0;

    for (let i = 0; i < iterations; i++) {
      if (this._suspendedTime <= impl.currentTime) {
        this._writeIndex = writeIndex;
        return suspendRendering.call(this);
      } else {
        impl.process(channelData, writeIndex);
        writeIndex += blockSize;
      }
    }
    this._writeIndex = writeIndex;

    if (writeIndex === audioDataLength) {
      doneRendering.call(this, audioData);
    } else {
      setImmediate(loop);
    }
  };

  impl.changeState(RUNNING);

  setImmediate(loop);
}

class PCMArrayBufferWriter {
  constructor(buffer) {
    this._view = new DataView(buffer);
    this._pos = 0;
  }

  pcm8(value) {
    value = Math.max(-1, Math.min(value, +1));
    value = (value * 0.5 + 0.5) * 128;
    this._view.setUint8(this._pos, value | 0);
    this._pos += 1;
  }

  pcm16(value) {
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? value * 32768 : value * 32767;
    this._view.setInt16(this._pos, value | 0, true);
    this._pos += 2;
  }

  pcm32(value) {
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? value * 2147483648 : value * 2147483647;
    this._view.setInt32(this._pos, value | 0, true);
    this._pos += 4;
  }

  pcm32f(value) {
    this._view.setFloat32(this._pos, value, true);
    this._pos += 4;
  }
}

class PCMBufferWriter {
  constructor(buffer) {
    this._buffer = buffer;
    this._pos = 0;
  }

  pcm8(value) {
    value = Math.max(-1, Math.min(value, +1));
    value = (value * 0.5 + 0.5) * 128;
    this._buffer.writeUInt8(value | 0, this._pos);
    this._pos += 1;
  }

  pcm16(value) {
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? value * 32768 : value * 32767;
    this._buffer.writeInt16LE(value | 0, this._pos);
    this._pos += 2;
  }

  pcm32(value) {
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? value * 2147483648 : value * 2147483647;
    this._buffer.writeInt32LE(value | 0, this._pos);
    this._pos += 4;
  }

  pcm32f(value) {
    this._buffer.writeFloatLE(value, this._pos);
    this._pos += 4;
  }
}

const Buffer = global.Buffer;
const PCMWriter = getPCMWriter();
const alloc = getAllocFunction();

function create(length, format) {
  const bitDepth = resolveBitDepth(format.bitDepth, format.float);
  const methodName = resolveWriteMethodName(bitDepth, format.float);
  const bytes = bitDepth >> 3;
  const numberOfChannels = format.channels;

  if (numberOfChannels === 1) {
    return {
      encode(channelData, offset = 0, len = length) {
        const buffer = alloc(len * bytes);
        const writer = new PCMWriter(buffer);
        const output = channelData[0];

        for (let i = offset; i < len; i++) {
          writer[methodName](output[i]);
        }

        return buffer;
      },
    };
  }

  if (numberOfChannels === 2) {
    return {
      encode(channelData, offset = 0, len = length) {
        const buffer = alloc(2 * len * bytes);
        const writer = new PCMWriter(buffer);
        const outputL = channelData[0];
        const outputR = channelData[1];

        for (let i = offset; i < len; i++) {
          writer[methodName](outputL[i]);
          writer[methodName](outputR[i]);
        }

        return buffer;
      },
    };
  }

  return {
    encode(channelData, offset = 0, len = length) {
      const buffer = alloc(numberOfChannels * len * bytes);
      const writer = new PCMWriter(buffer);

      for (let i = offset; i < len; i++) {
        for (let ch = 0; ch < numberOfChannels; ch++) {
          writer[methodName](channelData[ch][i]);
        }
      }

      return buffer;
    },
  };
}

/* istanbul ignore next */
function resolveBitDepth(bitDepth, float) {
  return float ? 32 : bitDepth;
}

/* istanbul ignore next */
function resolveWriteMethodName(bitDepth, float) {
  if (float) {
    return 'pcm32f';
  }
  return 'pcm' + bitDepth;
}

/* istanbul ignore next */
function getPCMWriter() {
  return Buffer ? PCMBufferWriter : PCMArrayBufferWriter;
}

/* istanbul ignore next */
function getAllocFunction() {
  return Buffer ? (Buffer.alloc ? Buffer.alloc : newBuffer) : newArrayBuffer;
}

/* istanbul ignore next */
function newBuffer(size) {
  return new Buffer(size);
}

/* istanbul ignore next */
function newArrayBuffer(size) {
  return new Uint8Array(size).buffer;
}

var PCMEncoder = { create };

const noopWriter = { write: () => true };

class StreamAudioContext extends BaseAudioContext {
  /**
   * @param {object}  opts
   * @param {number}  opts.sampleRate
   * @param {number}  opts.blockSize
   * @param {number}  opts.numberOfChannels
   * @param {number}  opts.bitDepth
   * @param {boolean} opts.floatingPoint
   */
  constructor(opts = {}) {
    let sampleRate = defaults(opts.sampleRate, config.sampleRate);
    let blockSize = defaults(opts.blockSize, config.blockSize);
    let numberOfChannels = defaults(
      opts.channels || opts.numberOfChannels,
      config.numberOfChannels,
    );
    let bitDepth = defaults(opts.bitDepth, config.bitDepth);
    let floatingPoint = opts.float || opts.floatingPoint;

    sampleRate = toValidSampleRate(sampleRate);
    blockSize = toValidBlockSize(blockSize);
    numberOfChannels = toValidNumberOfChannels(numberOfChannels);
    bitDepth = toValidBitDepth(bitDepth);
    floatingPoint = !!floatingPoint;

    super({ sampleRate, blockSize, numberOfChannels });

    const format = {
      sampleRate,
      channels: numberOfChannels,
      bitDepth,
      float: floatingPoint,
    };
    const encoder = PCMEncoder.create(blockSize, format);

    defineProp(this, '_numberOfChannels', numberOfChannels);
    defineProp(this, '_encoder', encoder);
    defineProp(this, '_blockSize', blockSize);
    defineProp(this, '_stream', noopWriter);
    defineProp(this, '_isPlaying', false);
    defineProp(this, '_format', format);
  }

  /**
   * @return {number}
   */
  get numberOfChannels() {
    return this._impl.numberOfChannels;
  }

  /**
   * @return {number}
   */
  get blockSize() {
    return this._impl.blockSize;
  }

  /**
   * @return {object}
   */
  get format() {
    return this._format;
  }

  /**
   * @param {Writable}
   * @return {Writable}
   */
  pipe(stream) {
    this._stream = stream;
    return stream;
  }

  /**
   * @return {Promise<void>}
   */
  resume() {
    /* istanbul ignore else */
    if (this.state === SUSPENDED) {
      this._resume();
    }
    return super.resume();
  }

  /**
   * @return {Promise<void>}
   */
  suspend() {
    /* istanbul ignore else */
    if (this.state === RUNNING) {
      this._suspend();
    }
    return this._impl.suspend();
  }

  /**
   * @return {Promise<void>}
   */
  close() {
    /* istanbul ignore else */
    if (this.state !== CLOSED) {
      this._close();
    }
    return super.close();
  }

  _resume() {
    const contextStartTime = this.currentTime;
    const timerStartTime = Date.now();
    const encoder = this._encoder;
    const impl = this._impl;
    const aheadTime = 0.1;
    const channelData = nmap(
      this._numberOfChannels,
      () => new Float32Array(this._blockSize),
    );

    const renderingProcess = () => {
      if (this._isPlaying) {
        const contextElapsed = impl.currentTime - contextStartTime;
        const timerElapsed = (Date.now() - timerStartTime) / 1000;

        if (contextElapsed < timerElapsed + aheadTime) {
          impl.process(channelData, 0);

          const buffer = encoder.encode(channelData);

          if (!this._stream.write(buffer)) {
            this._stream.once('drain', renderingProcess);
            return;
          }
        }

        setTimeout(renderingProcess, 0);
      }
    };
    this._isPlaying = true;
    setImmediate(renderingProcess);
  }

  _suspend() {
    this._isPlaying = false;
  }

  _close() {
    this._suspend();
    /* istanbul ignore else */
    if (this._stream !== null) {
      this._stream = null;
    }
  }
}

/**
 * @param {function}  encodeFn
 * @param {AudioData} audioData
 * @param {object}    opts
 */
function encode(encodeFn, audioData, /* istanbul ignore next */ opts = {}) {
  if (!isAudioData(audioData)) {
    audioData = toAudioData(audioData);
  }
  return encodeFn(audioData, opts);
}

const encoders = {};

/**
 * @param {string}    type
 * @return {function}
 */
function get$1(type) {
  return encoders[type] || null;
}

/**
 * @param {string}   type
 * @param {function} fn
 */
function set$1(type, fn) {
  /* istanbul ignore else */
  if (typeof fn === 'function') {
    encoders[type] = fn;
  }
}

/**
 * @param {AudioData} audioData
 * @param {object}    opts
 * @return {Promise<ArrayBuffer>}
 */
function encode$1(audioData, /* istanbul ignore next */ opts = {}) {
  const type = opts.type || 'wav';
  const encodeFn = encoders[type];

  if (typeof encodeFn !== 'function') {
    return Promise.reject(
      new TypeError(`Encoder does not support the audio format: ${type}`),
    );
  }

  return encode(encodeFn, audioData, opts);
}

set$1('wav', WavEncoder.encode);

var encoder = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get$1,
  set: set$1,
  encode: encode$1
});

class RenderingAudioContext extends BaseAudioContext {
  /**
   * @param {object}  opts
   * @param {number}  opts.sampleRate
   * @param {number}  opts.blockSize
   * @param {number}  opts.numberOfChannels
   * @param {number}  opts.bitDepth
   * @param {boolean} opts.floatingPoint
   */
  constructor(opts = {}) {
    let sampleRate = defaults(opts.sampleRate, config.sampleRate);
    let blockSize = defaults(opts.blockSize, config.blockSize);
    let numberOfChannels = defaults(
      opts.channels || opts.numberOfChannels,
      config.numberOfChannels,
    );
    let bitDepth = defaults(opts.bitDepth, config.bitDepth);
    let floatingPoint = opts.float || opts.floatingPoint;

    sampleRate = toValidSampleRate(sampleRate);
    blockSize = toValidBlockSize(blockSize);
    numberOfChannels = toValidNumberOfChannels(numberOfChannels);
    bitDepth = toValidBitDepth(bitDepth);
    floatingPoint = !!floatingPoint;

    super({ sampleRate, blockSize, numberOfChannels });

    defineProp(this, '_format', {
      sampleRate,
      channels: numberOfChannels,
      bitDepth,
      float: floatingPoint,
    });
    defineProp(this, '_rendered', []);
  }

  /**
   * @return {number}
   */
  get numberOfChannels() {
    return this._impl.numberOfChannels;
  }

  /**
   * @return {number}
   */
  get blockSize() {
    return this._impl.blockSize;
  }

  /**
   * @return {object}
   */
  get format() {
    return this._format;
  }

  /**
   * @param {number|string} time
   */
  processTo(time) {
    time = toAudioTime(time);

    const duration = time - this.currentTime;

    /* istanbul ignore next */
    if (duration <= 0) {
      return;
    }

    const impl = this._impl;
    const blockSize = impl.blockSize;
    const iterations = Math.ceil((duration * this.sampleRate) / blockSize);
    const bufferLength = blockSize * iterations;
    const numberOfChannels = this._format.channels;
    const buffers = nmap(
      numberOfChannels,
      () => new Float32Array(bufferLength),
    );

    impl.changeState(RUNNING);

    for (let i = 0; i < iterations; i++) {
      impl.process(buffers, i * blockSize);
    }

    this._rendered.push(buffers);

    impl.changeState(SUSPENDED);
  }

  /**
   * @return {AudioData}
   */
  exportAsAudioData() {
    const numberOfChannels = this._format.channels;
    const length = this._rendered.reduce(
      (length, buffers) => length + buffers[0].length,
      0,
    );
    const sampleRate = this._format.sampleRate;
    const channelData = nmap(numberOfChannels, () => new Float32Array(length));
    const audioData = { numberOfChannels, length, sampleRate, channelData };

    let offset = 0;

    this._rendered.forEach((buffers) => {
      for (let ch = 0; ch < numberOfChannels; ch++) {
        channelData[ch].set(buffers[ch], offset);
      }
      offset += buffers[0].length;
    });

    return audioData;
  }

  /**
   * @param {AudioData} audioData
   * @param {object}    opts
   */
  encodeAudioData(audioData, opts) {
    opts = Object.assign({}, this._format, opts);
    return encode$1(audioData, opts);
  }
}

const DSPAlgorithm$2 = [];

class WebAudioContext extends BaseAudioContext {
  /**
   * @param {object}  opts
   * @param {AudioContext} opts.context
   * @param {AudioNode}    opts.destination
   * @param {number}       opts.blockSize
   * @param {number}       opts.numberOfChannels
   * @param {number}       opts.bufferSize
   */
  constructor(opts = {}) {
    const destination = opts.destination || opts.context.destination;
    const context = destination.context;
    const sampleRate = context.sampleRate;
    let blockSize = defaults(opts.blockSize, config.blockSize);
    let numberOfChannels = defaults(
      opts.numberOfChannels,
      config.numberOfChannels,
    );
    let bufferSize = defaults(opts.bufferSize, 1024);

    blockSize = toValidBlockSize(blockSize);
    numberOfChannels = toValidNumberOfChannels(numberOfChannels);
    bufferSize = toPowerOfTwo(bufferSize);
    bufferSize = Math.max(256, Math.min(bufferSize, 16384));

    super({ sampleRate, blockSize, numberOfChannels });

    const processor = context.createScriptProcessor(
      bufferSize,
      0,
      numberOfChannels,
    );
    const dspProcess = DSPAlgorithm$2[numberOfChannels] || DSPAlgorithm$2[0];

    processor.onaudioprocess = dspProcess(
      this._impl,
      numberOfChannels,
      bufferSize,
    );

    defineProp(this, '_originalContext', context);
    defineProp(this, '_destination', destination);
    defineProp(this, '_processor', processor);
  }

  get originalContext() {
    return this._originalContext;
  }

  /**
   * @return {Promise<void>}
   */
  resume() {
    if (this._processor) {
      this._processor.connect(this._destination);
    }
    return super.resume();
  }

  /**
   * @return {Promise<void>}
   */
  suspend() {
    if (this._processor) {
      this._processor.disconnect();
    }
    return this._impl.suspend();
  }

  /**
   * @return {Promise<void>}
   */
  close() {
    if (this._processor) {
      this._processor.disconnect();
      this._processor = null;
    }
    return super.close();
  }
}

DSPAlgorithm$2[0] = (impl, numberOfChannels, bufferSize) => {
  const blockSize = impl.blockSize;
  const iterations = bufferSize / blockSize;
  const channelData = new Array(numberOfChannels);

  return (e) => {
    const outputBuffer = e.outputBuffer;

    for (let ch = 0; ch < numberOfChannels; ch++) {
      channelData[ch] = outputBuffer.getChannelData(ch);
    }

    for (let i = 0; i < iterations; i++) {
      impl.process(channelData, i * blockSize);
    }
  };
};

DSPAlgorithm$2[1] = (impl, numberOfChannels, bufferSize) => {
  const blockSize = impl.blockSize;
  const iterations = bufferSize / blockSize;

  return (e) => {
    const channelData = [e.outputBuffer.getChannelData(0)];

    for (let i = 0; i < iterations; i++) {
      impl.process(channelData, i * blockSize);
    }
  };
};

DSPAlgorithm$2[2] = (impl, numberOfChannels, bufferSize) => {
  const blockSize = impl.blockSize;
  const iterations = bufferSize / blockSize;

  return (e) => {
    const outputBuffer = e.outputBuffer;
    const channelData = [
      outputBuffer.getChannelData(0),
      outputBuffer.getChannelData(1),
    ];

    for (let i = 0; i < iterations; i++) {
      impl.process(channelData, i * blockSize);
    }
  };
};

class RawDataAudioContext extends BaseAudioContext {
    constructor({ sampleRate = config.sampleRate, blockSize = config.blockSize, numberOfChannels = config.numberOfChannels, } = {}) {
        sampleRate = toValidSampleRate(sampleRate);
        blockSize = toValidBlockSize(blockSize);
        numberOfChannels = toValidNumberOfChannels(numberOfChannels);
        super({ sampleRate, blockSize, numberOfChannels });
        this.blockSize = blockSize;
        this.numberOfChannels = numberOfChannels;
    }
    suspend() {
        return this._impl.suspend();
    }
    createAudioBuffer(length, sampleRate, channels) {
        return new AudioBuffer$1(new AudioData(channels.length, length, sampleRate, channels));
    }
    process(channelBuffers, offset = 0) {
        this._impl.process(channelBuffers, offset);
    }
}

class SpatialListener {
  constructor(context, impl) {
    defineProp(this, '_context', context);
    defineProp(this, '_impl', impl);

    this._impl.$positionX = new AudioParam$1(context, this._impl.getPositionX());
    this._impl.$positionY = new AudioParam$1(context, this._impl.getPositionY());
    this._impl.$positionZ = new AudioParam$1(context, this._impl.getPositionZ());
    this._impl.$forwardX = new AudioParam$1(context, this._impl.getForwardX());
    this._impl.$forwardY = new AudioParam$1(context, this._impl.getForwardY());
    this._impl.$forwardZ = new AudioParam$1(context, this._impl.getForwardZ());
    this._impl.$upX = new AudioParam$1(context, this._impl.getUpX());
    this._impl.$upY = new AudioParam$1(context, this._impl.getUpY());
    this._impl.$upZ = new AudioParam$1(context, this._impl.getUpZ());
  }

  get positionX() {
    return this._impl.$positionX;
  }

  get positionY() {
    return this._impl.$positionY;
  }

  get positionZ() {
    return this._impl.$positionZ;
  }

  get forwardX() {
    return this._impl.$forwardX;
  }

  get forwardY() {
    return this._impl.$forwardY;
  }

  get forwardZ() {
    return this._impl.$forwardZ;
  }

  get upX() {
    return this._impl.$upX;
  }

  get upY() {
    return this._impl.$upY;
  }

  get upZ() {
    return this._impl.$upZ;
  }
}

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AnalyserNode: AnalyserNode$1,
  AudioBuffer: AudioBuffer$1,
  AudioBufferSourceNode: AudioBufferSourceNode$1,
  AudioDestinationNode: AudioDestinationNode$1,
  AudioListener: AudioListener$1,
  AudioNode: AudioNode$1,
  AudioParam: AudioParam$1,
  AudioScheduledSourceNode: AudioScheduledSourceNode$1,
  BaseAudioContext: BaseAudioContext,
  BiquadFilterNode: BiquadFilterNode$1,
  ChannelMergerNode: ChannelMergerNode$1,
  ChannelSplitterNode: ChannelSplitterNode$1,
  ConstantSourceNode: ConstantSourceNode$2,
  ConvolverNode: ConvolverNode$1,
  DelayNode: DelayNode$1,
  DynamicsCompressorNode: DynamicsCompressorNode$1,
  EventTarget: EventTarget$1,
  GainNode: GainNode$1,
  IIRFilterNode: IIRFilterNode$1,
  OscillatorNode: OscillatorNode$1,
  PannerNode: PannerNode$1,
  PeriodicWave: PeriodicWave$1,
  ScriptProcessorNode: ScriptProcessorNode$1,
  SpatialListener: SpatialListener,
  SpatialPannerNode: SpatialPannerNode$1,
  StereoPannerNode: StereoPannerNode$1,
  WaveShaperNode: WaveShaperNode$1
});

exports.OfflineAudioContext = OfflineAudioContext;
exports.RawDataAudioContext = RawDataAudioContext;
exports.RenderingAudioContext = RenderingAudioContext;
exports.StreamAudioContext = StreamAudioContext;
exports.WebAudioContext = WebAudioContext;
exports.api = index$1;
exports.decoder = decoder;
exports.encoder = encoder;
exports.impl = index;
//# sourceMappingURL=web-audio-js.js.map
