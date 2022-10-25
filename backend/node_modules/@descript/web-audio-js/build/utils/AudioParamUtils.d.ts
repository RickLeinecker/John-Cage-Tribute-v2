/**
 * @param {object[]} timeline
 * @param {number}   time
 * @param {number}   defaultValue
 */
export function computeValueAtTime(timeline: object[], time: number, defaultValue: number): number;
export function getLinearRampToValueAtTime(t: any, v0: any, v1: any, t0: any, t1: any): any;
export function getExponentialRampToValueAtTime(t: any, v0: any, v1: any, t0: any, t1: any): any;
export function getTargetValueAtTime(t: any, v0: any, v1: any, t0: any, timeConstant: any): any;
export function getValueCurveAtTime(t: any, curve: any, t0: any, duration: any): any;
