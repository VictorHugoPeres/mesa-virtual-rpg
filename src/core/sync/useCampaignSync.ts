"use client";

import { useEffect, useRef, useCallback } from "react";
import { SyncEvent, SyncEventType } from "./syncTypes";
import { createBroadcastChannel, postBroadcastEvent } from "./broadcast";

interface UseCampaignSyncOptions {
  campaignId: string;
  onEvent?: (event: SyncEvent) => void;
}

export function useCampaignSync({ campaignId, onEvent }: UseCampaignSyncOptions) {
  const hasListener = Boolean(onEvent);
  const processedEvents = useRef<Set<string>>(new Set());
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  // Processa o evento garantindo unicidade (deduplicação)
  const handleIncomingEvent = useCallback((event: SyncEvent) => {
    if (!event || !event.id) return;
    if (processedEvents.current.has(event.id)) return;

    processedEvents.current.add(event.id);
    if (processedEvents.current.size > 100) {
      // Limpa eventos antigos para não crescer indefinidamente
      const firstItems = Array.from(processedEvents.current).slice(0, 50);
      firstItems.forEach((id) => processedEvents.current.delete(id));
    }

    if (onEventRef.current) {
      onEventRef.current(event);
    }
  }, []);

  // 1. Conexão via BroadcastChannel (mesmo navegador/PC) - apenas se houver listener
  useEffect(() => {
    if (!campaignId || !hasListener) return;

    const channel = createBroadcastChannel(campaignId);
    if (!channel) return;

    const onMessage = (msg: MessageEvent<SyncEvent>) => {
      handleIncomingEvent(msg.data);
    };

    channel.addEventListener("message", onMessage);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, [campaignId, hasListener, handleIncomingEvent]);

  // 2. Conexão via Server-Sent Events (rede local / outros dispositivos) - apenas se houver listener
  useEffect(() => {
    if (!campaignId || !hasListener || typeof window === "undefined") return;

    let eventSource: EventSource | null = null;
    let retryTimer: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      eventSource = new EventSource(`/api/sync?campaignId=${campaignId}`);

      eventSource.onmessage = (e) => {
        try {
          const event: SyncEvent = JSON.parse(e.data);
          handleIncomingEvent(event);
        } catch {
          // Ignora mensagens de keep-alive / formato incorreto
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // Reconectar após 4 segundos em caso de queda de rede
        retryTimer = setTimeout(connectSSE, 4000);
      };
    };

    connectSSE();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (eventSource) eventSource.close();
    };
  }, [campaignId, hasListener, handleIncomingEvent]);

  // 3. Emissor híbrido (BroadcastChannel + SSE POST)
  const emit = useCallback(
    async <T>(type: SyncEventType, payload: T) => {
      if (!campaignId) return;

      const event: SyncEvent<T> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type,
        campaignId,
        payload,
        timestamp: Date.now(),
      };

      // Dispara no BroadcastChannel local instantaneamente
      postBroadcastEvent(campaignId, event as SyncEvent);

      // Marca o próprio evento como já processado localmente
      processedEvents.current.add(event.id);

      // Dispara no backend via POST para alcançar outros clientes via SSE
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaignId, type, payload }),
        });
      } catch (err) {
        console.warn("Erro ao emitir evento SSE:", err);
      }
    },
    [campaignId]
  );

  return { emit };
}
