"use client";

import React from "react";
import {
  Order,
  OrderStatus,
} from "@/lib/types";
import {
  Clock,
  FileCheck,
  Package,
  Bike,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Pill,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface OrderTrackingCardProps {
  order: Order;
  onOpenDetails?: (order: Order) => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: "CRIADO",
    label: "Pedido Solicitado",
    description: "Pedido recebido no sistema",
  },
  {
    status: "RECEITA_EM_ANALISE",
    label: "Validação da Receita",
    description: "Farmacêutico avaliando",
  },
  {
    status: "APROVADO_PREPARACAO",
    label: "Em Separação",
    description: "Baixa no estoque e embalagem",
  },
  {
    status: "AGUARDANDO_COLETA",
    label: "Pronto no Polo",
    description: "Aguardando motoboy",
  },
  {
    status: "EM_ROTA",
    label: "Saiu para Entrega",
    description: "Motoboy a caminho da sua casa",
  },
  {
    status: "ENTREGUE",
    label: "Entregue ao Paciente",
    description: "Recebido com assinatura",
  },
];

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({ order }) => {
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case "CRIADO":
        return 0;
      case "RECEITA_EM_ANALISE":
        return 1;
      case "APROVADO_PREPARACAO":
        return 2;
      case "AGUARDANDO_COLETA":
        return 3;
      case "EM_ROTA":
        return 4;
      case "ENTREGUE":
        return 5;
      case "RECUSADO":
      case "CANCELADO":
      case "FALHA_ENTREGA":
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);
  const isFailedOrCanceled = currentIndex === -1;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "EM_ROTA":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Bike className="w-3.5 h-3.5" />
            Em Rota de Entrega
          </span>
        );
      case "ENTREGUE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Entregue com Sucesso
          </span>
        );
      case "APROVADO_PREPARACAO":
      case "AGUARDANDO_COLETA":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Package className="w-3.5 h-3.5" />
            Preparando no Polo
          </span>
        );
      case "RECEITA_EM_ANALISE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <FileCheck className="w-3.5 h-3.5" />
            Receita em Análise
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-3.5 h-3.5" />
            Solicitado
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Protocolo SUS
            </span>
            <span className="text-sm font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {order.protocolo}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Solicitado em{" "}
            {new Date(order.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Progress Timeline */}
      <div className="p-5 sm:p-6">
        {!isFailedOrCanceled ? (
          <div className="relative">
            <div className="hidden md:flex justify-between items-center relative mb-8">
              {/* Connector Bar */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentIndex / (ORDER_STEPS.length - 1)) * 100
                    )}%`,
                  }}
                />
              </div>

              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={step.status}
                    className="relative z-10 flex flex-col items-center text-center"
                    style={{ width: `${100 / ORDER_STEPS.length}%` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-semibold ${
                        isCurrent
                          ? "text-emerald-700 font-bold"
                          : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile simplified timeline view */}
            <div className="md:hidden flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                {order.status === "EM_ROTA" ? (
                  <Bike className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-900 block">
                  Status Atual: {ORDER_STEPS[currentIndex]?.label || order.status}
                </span>
                <span className="text-emerald-700">
                  {ORDER_STEPS[currentIndex]?.description}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-800 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold">Pedido Não Concluído / Recusado</p>
              <p>{order.justificativa_recusa || "Entre em contato com a sua UBS de referência para mais informações."}</p>
            </div>
          </div>
        )}

        {/* Live Delivery Banner if In Route */}
        {order.status === "EM_ROTA" && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Motoboy em deslocamento
                </h4>
                <p className="text-xs text-slate-600">
                  Previsão de chegada: <strong>Hoje até as 12:30</strong> (Tenha um documento com foto em mãos)
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
              Entregador: Carlos E. • Honda CG 160 (ABC-1234)
            </div>
          </div>
        )}

        {/* Medication items and destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Medicamentos */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <h5 className="font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              Medicamentos no Pedido ({order.items.length})
            </h5>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/60"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {item.medication?.nome_comercial || item.medication?.principio_ativo}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.medication?.dosagem} • {item.medication?.forma_farmaceutica}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                      Qtd: {item.quantidade_solicitada}
                    </span>
                    {item.lote_atendido && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Lote: {item.lote_atendido}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Endereço de Entrega Cadastrado
              </h5>
              <p className="text-slate-800 font-medium leading-relaxed">
                {order.endereco_entrega_rua}, {order.endereco_entrega_numero}
              </p>
              <p className="text-slate-500">
                {order.endereco_entrega_bairro} • {order.endereco_entrega_cidade}/
                {order.endereco_entrega_uf} - CEP {order.endereco_entrega_cep}
              </p>
              {order.observacao_paciente && (
                <p className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 italic">
                  &ldquo;{order.observacao_paciente}&rdquo;
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Entrega 100% Gratuita SUS
              </span>
              <span className="font-semibold text-slate-700">
                Polo São Paulo Sul
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
