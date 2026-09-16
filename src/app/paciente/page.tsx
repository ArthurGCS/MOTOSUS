"use client";

import React, { useState } from "react";
import { PatientHeader } from "@/components/paciente/PatientHeader";
import { OrderTrackingCard } from "@/components/paciente/OrderTrackingCard";
import { RequestMedicationView } from "@/components/paciente/RequestMedicationView";
import { AutomaticRefillCard } from "@/components/paciente/AutomaticRefillCard";
import { WhatsAppNotificationModal } from "@/components/notifications/WhatsAppNotificationModal";
import {
  MOCK_CURRENT_USER,
  MOCK_MEDICATIONS,
  MOCK_PRESCRIPTIONS,
  MOCK_ORDERS,
} from "@/lib/mock-data";
import { Order, Prescription } from "@/lib/types";
import {
  Package,
  PlusCircle,
  FileCheck2,
  FileText,
  Clock,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function PacientePage() {
  const [activeTab, setActiveTab] = useState<"pedidos" | "solicitar" | "receitas">(
    "pedidos"
  );
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [prescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
  const [selectedWhatsAppOrder, setSelectedWhatsAppOrder] = useState<Order | null>(
    null
  );

  const handleOrderCreated = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setActiveTab("pedidos");
  };

  const activeOrders = orders.filter(
    (o) => o.status !== "ENTREGUE" && o.status !== "CANCELADO" && o.status !== "RECUSADO"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "ENTREGUE" || o.status === "CANCELADO" || o.status === "RECUSADO"
  );

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Header */}
      <PatientHeader
        user={MOCK_CURRENT_USER}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* TAB 1: MEUS PEDIDOS & RASTREIO */}
        {activeTab === "pedidos" && (
          <div className="space-y-6">
            {/* Automatic Refill Suggestion Card */}
            <AutomaticRefillCard
              onRequestRefill={() => setActiveTab("solicitar")}
            />

            {/* Pedidos em Andamento */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Pedidos em Andamento ({activeOrders.length})
                  </h3>
                </div>

                {activeOrders.length > 0 && (
                  <button
                    onClick={() => setSelectedWhatsAppOrder(activeOrders[0])}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ver Alerta WhatsApp</span>
                  </button>
                )}
              </div>

              {activeOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  Nenhum pedido em andamento no momento. Solicite seus medicamentos contínuos quando desejar.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderTrackingCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>

            {/* Histórico Concluído */}
            {completedOrders.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck2 className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                    Histórico de Entregas Realizadas ({completedOrders.length})
                  </h3>
                </div>
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <OrderTrackingCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SOLICITAR MEDICAMENTO */}
        {activeTab === "solicitar" && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Solicitar Medicamento pelo MOTOSUS
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Selecione os medicamentos da sua receita médica e confirme o endereço para a entrega.
              </p>
            </div>

            <RequestMedicationView
              user={MOCK_CURRENT_USER}
              availableMedications={MOCK_MEDICATIONS}
              userPrescriptions={prescriptions}
              onOrderCreated={handleOrderCreated}
            />
          </div>
        )}

        {/* TAB 3: MINHAS RECEITAS */}
        {activeTab === "receitas" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Minhas Receitas Médicas
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Receitas validadas pelo corpo de farmacêuticos do SUS para dispensação contínua.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("solicitar")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Enviar Nova Receita</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((presc) => (
                <div
                  key={presc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {presc.medico_nome}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            CRM: {presc.medico_crm}/{presc.medico_uf_crm}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          presc.status === "VALIDADA"
                            ? "bg-emerald-100 text-emerald-800"
                            : presc.status === "PENDENTE_VALIDACAO"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {presc.status === "VALIDADA"
                          ? "Validada"
                          : presc.status === "PENDENTE_VALIDACAO"
                          ? "Em Análise"
                          : "Rejeitada"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center justify-between">
                        <span>Emissão da Receita:</span>
                        <span className="font-semibold text-slate-800">
                          {new Date(presc.data_emissao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Validade do Tratamento:</span>
                        <span className="font-semibold text-slate-800">
                          {new Date(presc.data_validade).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      {presc.observacoes_farmaceutico && (
                        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                          <strong className="text-slate-700">Parecer do Farmacêutico:</strong>{" "}
                          {presc.observacoes_farmaceutico}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Receita Digitalizada
                    </span>
                    <button
                      onClick={() => setActiveTab("solicitar")}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Pedir com esta receita →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* WhatsApp Modal Simulator */}
      <WhatsAppNotificationModal
        order={selectedWhatsAppOrder}
        onClose={() => setSelectedWhatsAppOrder(null)}
      />
    </div>
  );
}
