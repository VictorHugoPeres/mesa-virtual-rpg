import { SyncEvent } from "./syncTypes";

const CHANNEL_PREFIX = "mesa-virtual-sync:";

export function createBroadcastChannel(campaignId: string) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }

  try {
    return new BroadcastChannel(`${CHANNEL_PREFIX}${campaignId}`);
  } catch (err) {
    console.warn("BroadcastChannel não suportado:", err);
    return null;
  }
}

export function postBroadcastEvent(campaignId: string, event: SyncEvent) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return;
  }

  try {
    const channel = new BroadcastChannel(`${CHANNEL_PREFIX}${campaignId}`);
    channel.postMessage(event);
    channel.close();
  } catch (err) {
    console.warn("Erro ao postar em BroadcastChannel:", err);
  }
}
