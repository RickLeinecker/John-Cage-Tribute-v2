/// <reference types="node" />
export default EventTarget;
declare class EventTarget {
    _emitter: events.EventEmitter;
    /**
     * @param {string}   type
     * @param {function} listener
     */
    addEventListener(type: string, listener: Function): void;
    /**
     * @param {string}   type
     * @param {function} listener
     */
    removeEventListener(type: string, listener: Function): void;
    /**
     * @param {string}   type
     * @param {function} oldListener
     * @param {function} newListener
     */
    replaceEventListener(type: string, oldListener: Function, newListener: Function): void;
    /**
     * @param {object} event
     * @param {string} event.type
     */
    dispatchEvent(event: {
        type: string;
    }): void;
}
import events from "events";
