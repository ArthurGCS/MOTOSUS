import { NextRequest } from "next/server";
import { db } from "@/lib/db-store";

// Server-Sent Events (SSE) stream for real-time updates across Paciente, Farmacêutico e Entregador
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: "connected", timestamp: new Date().toISOString() })}\n\n`)
      );

      // Periodically stream latest system stats and active orders
      const interval = setInterval(() => {
        try {
          const orders = db.getOrders();
          const inRouteCount = orders.filter((o) => o.status === "EM_ROTA").length;
          const pendingPickup = orders.filter((o) => o.status === "AGUARDANDO_COLETA").length;

          const payload = {
            timestamp: new Date().toISOString(),
            total_orders: orders.length,
            in_route: inRouteCount,
            ready_pickup: pendingPickup,
          };

          controller.enqueue(
            encoder.encode(`event: update\ndata: ${JSON.stringify(payload)}\n\n`)
          );
        } catch (err) {
          clearInterval(interval);
        }
      }, 5000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
