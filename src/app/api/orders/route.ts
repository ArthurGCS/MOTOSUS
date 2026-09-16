import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-store";

// GET /api/orders - Listar pedidos com filtros opcionais
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const paciente_id = searchParams.get("paciente_id") || undefined;
  const polo_id = searchParams.get("polo_id") || undefined;

  const orders = db.getOrders({ status, paciente_id, polo_id });

  return NextResponse.json({
    success: true,
    total: orders.length,
    data: orders,
  });
}

// POST /api/orders - Criar nova solicitação de entrega de medicamentos do SUS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nenhum medicamento informado no pedido." },
        { status: 400 }
      );
    }

    const createdOrder = db.createOrder(body);

    return NextResponse.json(
      {
        success: true,
        message: "Pedido de medicamentos registrado com sucesso no SUS.",
        data: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Falha ao processar solicitação de pedido." },
      { status: 500 }
    );
  }
}
