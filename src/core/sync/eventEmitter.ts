import { EventEmitter } from "events";

declare global {
  // eslint-disable-next-line no-var
  var __syncBus: EventEmitter | undefined;
}

export const syncBus = globalThis.__syncBus || new EventEmitter();
syncBus.setMaxListeners(100);

if (process.env.NODE_ENV !== "production") {
  globalThis.__syncBus = syncBus;
}
