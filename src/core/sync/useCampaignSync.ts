"use client";

import { useEffect, useRef, useCallback } from "react";
import { SyncEvent, SyncEventType } from "./syncTypes";
import { createBroadcastChannel, postBroadcastEvent } from "./broadcast";
import { generateId } from "@/lib/id";

interface UseCampaignSyncOptions {
  campaignId: string;
  onEvent?: (event: SyncEvent) => void;
}

// Singleton de conexões SSE por campanha para evitar conexões duplicadas e loops no mobile
interface CampaignConnection {
  eventSource: EventSource | null;
  listeners: Set<(event: SyncEvent) => void>;
  disconnectTimer: NodeJS.Timeout | null;
  retryTimer: NodeJS.Timeout | null;
  retryCount: number;
}

const connections = new Map<string, CampaignConnection>();

function getOrCreateConnection(campaignId: string): CampaignConnection {
  let conn = connections.get(campaignId);
  if (!conn) {
    conn = {
      eventSource: null,
      listeners: new Set(),
      disconnectTimer: null,
      retryTimer: null,
      retryCount: 0,
    };
    connections.set(campaignId, conn);
  }
  return conn;
}

function startSSE(campaignId: string) {
  const conn = getOrCreateConnection(campaignId);
  if (conn.eventSource || typeof window === "undefined") return;

  try {
    const es = new EventSource(`/api/sync?campaignId=${campaignId}`);
    conn.eventSource = es;

    es.onmessage = (e) => {
      conn.retryCount = 0;
      try {
        const raw = JSON.parse(e.data);
        if (raw && (raw.type as string) !== "CONNECTED") {
          const event = raw as SyncEvent;
          conn.listeners.forEach((listener) => {
            try {
              listener(event);
            } catch (err) {
              console.warn("Erro no listener de sync:", err);
            }
          });
        }
      } catch {
        // Ignora pings de keep-alive
      }
    };

    es.onerror = () => {
      if (conn.eventSource) {
        conn.eventSource.close();
        conn.eventSource = null;
      }
      // Backoff progressivo: 3s, 6s, max 15s para não sobrecarregar rede móvel
      const delay = Math.min(15000, 3000 * Math.max(1, conn.retryCount));
      conn.retryCount += 1;
      if (conn.retryTimer) clearTimeout(conn.retryTimer);
      conn.retryTimer = setTimeout(() => {
        if (conn.listeners.size > 0) {
          startSSE(campaignId);
        }
      }, delay);
    };
  } catch (err) {
    console.warn("Falha ao abrir EventSource:", err);
  }
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
      const firstItems = Array.from(processedEvents.current).slice(0, 50);
      firstItems.forEach((id) => processedEvents.current.delete(id));
    }

    if (onEventRef.current) {
      onEventRef.current(event);
    }
  }, []);

  // 1. BroadcastChannel (mesma aba/PC)
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

  // 2. Conexão SSE compartilhada via Singleton (Mobile <-> PC <-> TV)
  useEffect(() => {
    if (!campaignId || !hasListener || typeof window === "undefined") return;

    const conn = getOrCreateConnection(campaignId);
    if (conn.disconnectTimer) {
      clearTimeout(conn.disconnectTimer);
      conn.disconnectTimer = null;
    }

    conn.listeners.add(handleIncomingEvent);

    if (!conn.eventSource) {
      startSSE(campaignId);
    }

    return () => {
      conn.listeners.delete(handleIncomingEvent);
      // Se não houver mais nenhum ouvinte na página, encerra após 8 segundos
      if (conn.listeners.size === 0) {
        if (conn.disconnectTimer) clearTimeout(conn.disconnectTimer);
        conn.disconnectTimer = setTimeout(() => {
          if (conn.listeners.size === 0) {
            if (conn.eventSource) {
              conn.eventSource.close();
              conn.eventSource = null;
            }
            if (conn.retryTimer) {
              clearTimeout(conn.retryTimer);
              conn.retryTimer = null;
            }
            connections.delete(campaignId);
          }
        }, 8000);
      }
    };
  }, [campaignId, hasListener, handleIncomingEvent]);

  // 3. Emissor híbrido (BroadcastChannel + SSE POST)
  const emit = useCallback(
    async <T>(type: SyncEventType, payload: T) => {
      if (!campaignId) return;

      const event: SyncEvent<T> = {
        id: generateId("evt"),
        type,
        campaignId,
        payload,
        timestamp: Date.now(),
      };

      postBroadcastEvent(campaignId, event as SyncEvent);
      processedEvents.current.add(event.id);

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
