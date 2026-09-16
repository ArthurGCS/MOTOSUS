import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-store";

// GET /api/orders/[id] - Detalhes do pedido com eventos de rastreamento
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = db.getOrderById(id);

  if (!order) {
    return NextResponse.json(
      { success: false, error: "Pedido não encontrado no sistema." },
      { status: 404 }
    );
  }

  const trackingEvents = db.getTrackingEventsByOrderId(order.id);

  return NextResponse.json({
    success: true,
    data: {
      ...order,
      tracking_events: trackingEvents,
    },
  });
}
