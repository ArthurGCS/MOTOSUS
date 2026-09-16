"use client";

import React from "react";
import { Order, OrderStatus } from "@/lib/types";
import {
  FileSearch,
  PackageCheck,
  Clock,
  Bike,
  CheckCircle2,
  ThermometerSnowflake,
  User,
  ArrowRight,
  MapPin,
  Pill,
} from "lucide-react";

interface PharmacistKanbanProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

interface ColumnConfig {
  id: string;
  title: string;
  statuses: OrderStatus[];
  icon: React.ReactNode;
  headerColor: string;
  badgeBg: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: "triagem",
    title: "Triagem & Receita",
    statuses: ["CRIADO", "RECEITA_EM_ANALISE"],
    icon: <FileSearch className="w-4 h-4 text-purple-600" />,
    headerColor: "border-purple-500 text-purple-900 bg-purple-50/50",
    badgeBg: "bg-purple-100 text-purple-800",
  },
  {
    id: "separacao",
    title: "Separação & Lote",
    statuses: ["APROVADO_PREPARACAO"],
    icon: <PackageCheck className="w-4 h-4 text-blue-600" />,
    headerColor: "border-blue-500 text-blue-900 bg-blue-50/50",
    badgeBg: "bg-blue-100 text-blue-800",
  },
  {
    id: "despacho",
    title: "Pronto p/ Motoboy",
    statuses: ["AGUARDANDO_COLETA"],
    icon: <Clock className="w-4 h-4 text-amber-600" />,
    headerColor: "border-amber-500 text-amber-900 bg-amber-50/50",
    badgeBg: "bg-amber-100 text-amber-800",
  },
  {
    id: "em_rota",
    title: "Em Rota de Entrega",
    statuses: ["EM_ROTA"],
    icon: <Bike className="w-4 h-4 text-emerald-600" />,
    headerColor: "border-emerald-500 text-emerald-900 bg-emerald-50/50",
    badgeBg: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "concluidos",
    title: "Entregues",
    statuses: ["ENTREGUE"],
    icon: <CheckCircle2 className="w-4 h-4 text-slate-600" />,
    headerColor: "border-slate-400 text-slate-900 bg-slate-100/60",
    badgeBg: "bg-slate-200 text-slate-800",
  },
];

export const PharmacistKanban: React.FC<PharmacistKanbanProps> = ({
  orders,
  onSelectOrder,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnOrders = orders.filter((o) =>
          col.statuses.includes(o.status)
        );

        return (
          <div
            key={col.id}
            className="bg-slate-100/90 rounded-2xl border border-slate-200 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div
              className={`p-3.5 rounded-t-2xl border-b-2 flex items-center justify-between ${col.headerColor}`}
            >
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-bold text-xs uppercase tracking-wider">
                  {col.title}
                </h3>
              </div>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-full ${col.badgeBg}`}
              >
                {columnOrders.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
              {columnOrders.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-1">
                  Nenhum pedido nesta etapa
                </div>
              ) : (
                columnOrders.map((order) => {
                  const hasColdChain = order.items.some(
                    (i) => i.medication?.temperatura_controlada
                  );
                  const hasAltoCusto = order.items.some(
                    (i) => i.medication?.categoria === "ALTO_CUSTO"
                  );

                  return (
                    <div
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        {/* Protocol & Badges */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {order.protocolo}
                          </span>

                          <div className="flex items-center gap-1">
                            {hasColdChain && (
                              <span
                                title="Medicamento Termolábil (Cadeia de Frio)"
                                className="p-1 rounded bg-cyan-100 text-cyan-700 text-[10px]"
                              >
                                <ThermometerSnowflake className="w-3 h-3" />
                              </span>
                            )}
                            {hasAltoCusto && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 uppercase">
                                Alto Custo
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Patient Name */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold mb-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {order.paciente?.nome_completo || "Paciente SUS"}
                          </span>
                        </div>

                        {/* Destination */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {order.endereco_entrega_bairro}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1 mb-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="text-[11px] text-slate-700 flex items-center justify-between"
                            >
                              <span className="truncate font-medium">
                                • {item.medication?.nome_comercial || item.medication?.principio_ativo}
                              </span>
                              <span className="font-bold text-slate-900 ml-2 shrink-0">
                                {item.quantidade_solicitada}x
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {new Date(order.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                          Conferir
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
