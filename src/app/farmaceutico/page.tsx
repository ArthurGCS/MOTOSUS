"use client";

import React, { useState } from "react";
import { PharmacistHeader } from "@/components/farmaceutico/PharmacistHeader";
import { PharmacistKPIs } from "@/components/farmaceutico/PharmacistKPIs";
import { PharmacistKanban } from "@/components/farmaceutico/PharmacistKanban";
import { PrescriptionValidationModal } from "@/components/farmaceutico/PrescriptionValidationModal";
import { PharmacistStockViewer } from "@/components/farmaceutico/PharmacistStockViewer";
import { MOCK_ORDERS, MOCK_MEDICATIONS } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";

export default function FarmaceuticoPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [medications] = useState(MOCK_MEDICATIONS);
  const [activeView, setActiveView] = useState<"kanban" | "estoque">("kanban");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setOrders(json.data);
        }
      }
    } catch (e) {
      // fallback
    }
  };

  React.useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    updatedData?: { lote?: string; justificativa?: string; parecer?: string }
  ) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            justificativa_recusa: updatedData?.justificativa || ord.justificativa_recusa,
            prescription: ord.prescription
              ? {
                  ...ord.prescription,
                  status:
                    newStatus === "RECUSADO"
                      ? "REJEITADA"
                      : newStatus === "CRIADO"
                      ? "PENDENTE_VALIDACAO"
                      : "VALIDADA",
                  observacoes_farmaceutico:
                    updatedData?.parecer || ord.prescription.observacoes_farmaceutico,
                }
              : undefined,
            updated_at: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          lote: updatedData?.lote,
          justificativa: updatedData?.justificativa,
          parecer: updatedData?.parecer,
        }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const urgentCount = orders.filter(
    (o) =>
      o.items.some((i) => i.medication?.temperatura_controlada) &&
      o.status !== "ENTREGUE"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/90 pb-16">
      {/* Header */}
      <PharmacistHeader
        poloName="Polo Centralizador de Distribuição São Paulo Sul - CNES 203948"
        pharmacistName="Dr. Marcos Rocha"
        crf="45.291"
        activeView={activeView}
        setActiveView={setActiveView}
        urgentCount={urgentCount}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPIs Summary */}
        <PharmacistKPIs orders={orders} />

        {/* View Switcher */}
        {activeView === "kanban" ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Fila de Triagem & Expedição de Medicamentos
                </h2>
                <p className="text-xs text-slate-500">
                  Clique em qualquer cartão para abrir o prontuário, validar a receita, registrar o lote e avançar a etapa.
                </p>
              </div>
            </div>

            <PharmacistKanban
              orders={orders}
              onSelectOrder={(order) => setSelectedOrder(order)}
            />
          </div>
        ) : (
          <PharmacistStockViewer medications={medications} />
        )}
      </main>

      {/* Prescription Validation / Action Modal */}
      <PrescriptionValidationModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
