export default EventTarget;
declare class EventTarget {
    addEventListener(type: any, listener: any): void;
    removeEventListener(type: any, listener: any): void;
}
