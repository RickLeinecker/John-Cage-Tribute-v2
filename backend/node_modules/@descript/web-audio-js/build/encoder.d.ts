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
 * @param {AudioData} audioData
 * @param {object}    opts
 * @return {Promise<ArrayBuffer>}
 */
export function encode(audioData: any, opts?: object): Promise<ArrayBuffer>;
