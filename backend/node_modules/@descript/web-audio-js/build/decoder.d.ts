/**
 * @param {string}    type
 * @return {function}
 */
export function get(type: string): Function;
/**
 * @param {string}   type
 * @param {function} fn
 */
export function set(type: string, fn: Function): void;
/**
 * @param {ArrayBuffer} AudioBuffer
 * @param {object}      opts
 * @return {Promise<AudioData>}
 */
export function decode(audioData: any, opts: object): Promise<any>;
