import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-store";
import { OrderStatus } from "@/lib/types";

const VALID_STATUSES: OrderStatus[] = [
  "CRIADO",
  "RECEITA_EM_ANALISE",
  "APROVADO_PREPARACAO",
  "AGUARDANDO_COLETA",
  "EM_ROTA",
  "ENTREGUE",
  "FALHA_ENTREGA",
  "CANCELADO",
  "RECUSADO",
];

// PATCH /api/orders/[id]/status - Atualização de status com lote, parecer ou recusa
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      lote,
      justificativa,
      parecer,
      foto_comprovante,
      nome_recebedor,
      documento_recebedor,
    } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status inválido. Status permitidos: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedOrder = db.updateOrderStatus(id, status, {
      lote,
      justificativa,
      parecer,
      foto_comprovante,
      nome_recebedor,
      documento_recebedor,
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado para atualização." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status do pedido atualizado com sucesso para ${status}.`,
      data: updatedOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno ao atualizar status do pedido." },
      { status: 500 }
    );
  }
}
