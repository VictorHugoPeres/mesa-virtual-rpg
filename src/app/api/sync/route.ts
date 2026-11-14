import { NextRequest } from "next/server";
import { syncBus } from "@/core/sync/eventEmitter";
import { SyncEvent } from "@/core/sync/syncTypes";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");

  if (!campaignId) {
    return new Response(JSON.stringify({ error: "campaignId obrigatório" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Envia confirmação de conexão inicial
      const initialPayload = JSON.stringify({
        type: "CONNECTED",
        campaignId,
        timestamp: Date.now(),
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      const handleEvent = (event: SyncEvent) => {
        if (event.campaignId === campaignId) {
          try {
            const data = JSON.stringify(event);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          } catch (err) {
            console.error("Erro ao enviar SSE:", err);
          }
        }
      };

      const eventName = `campaign:${campaignId}`;
      syncBus.on(eventName, handleEvent);

      // Ping a cada 25 segundos para manter a conexão ativa
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 25000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        syncBus.off(eventName, handleEvent);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, type, payload } = body;

    if (!campaignId || !type) {
      return new Response(
        JSON.stringify({ error: "campaignId e type são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const event: SyncEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      campaignId,
      payload,
      timestamp: Date.now(),
    };

    const eventName = `campaign:${campaignId}`;
    syncBus.emit(eventName, event);

    return new Response(JSON.stringify({ success: true, eventId: event.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro ao emitir evento sync:", err);
    return new Response(JSON.stringify({ error: "Erro interno no sync" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
