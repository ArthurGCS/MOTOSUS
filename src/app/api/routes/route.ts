import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-store";

// GET /api/routes - Retorna as rotas ativas agrupadas no polo
export async function GET() {
  const readyOrders = db.getOrders({ status: "AGUARDANDO_COLETA" });
  const inRouteOrders = db.getOrders({ status: "EM_ROTA" });
  const deliveredOrders = db.getOrders({ status: "ENTREGUE" });

  const routeSummary = {
    codigo_rota: "ROTA-SUL-20260915-01",
    polo_nome: "Polo Centralizador São Paulo Sul",
    entregador_nome: "Carlos Eduardo - Credenciado SUS",
    placa_moto: "ABC-1234 (Honda CG 160 Cargo)",
    total_paradas: readyOrders.length + inRouteOrders.length,
    pedidos_prontos_coleta: readyOrders,
    pedidos_em_transito: inRouteOrders,
    pedidos_concluidos: deliveredOrders,
  };

  return NextResponse.json({
    success: true,
    data: routeSummary,
  });
}
