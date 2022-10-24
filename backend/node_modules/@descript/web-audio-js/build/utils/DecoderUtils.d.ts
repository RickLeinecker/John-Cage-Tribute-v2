/**
 * @param {function}    decodeFn
 * @param {ArrayBuffer} audioData
 * @param {object}      opts
 * @return {Promise<AudioData>}
 */
export function decode(decodeFn: Function, audioData: ArrayBuffer, opts?: object): Promise<any>;
/**
 * @param {AudioData} audioData
 * @param {number}    sampleRate
 */
export function resample(audioData: any, sampleRate: number): any;
