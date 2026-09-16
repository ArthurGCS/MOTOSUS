"use client";

import React from "react";
import { Order } from "@/lib/types";
import {
  Clock,
  PackageCheck,
  Bike,
  CheckCircle2,
  FileSearch,
  ThermometerSnowflake,
} from "lucide-react";

interface PharmacistKPIsProps {
  orders: Order[];
}

export const PharmacistKPIs: React.FC<PharmacistKPIsProps> = ({ orders }) => {
  const pendingValidation = orders.filter(
    (o) => o.status === "CRIADO" || o.status === "RECEITA_EM_ANALISE"
  ).length;

  const inPreparation = orders.filter(
    (o) => o.status === "APROVADO_PREPARACAO"
  ).length;

  const readyForCourier = orders.filter(
    (o) => o.status === "AGUARDANDO_COLETA"
  ).length;

  const inRoute = orders.filter((o) => o.status === "EM_ROTA").length;

  const delivered = orders.filter((o) => o.status === "ENTREGUE").length;

  const coldChainCount = orders.filter((o) =>
    o.items.some((i) => i.medication?.temperatura_controlada)
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Triagem */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Triagem Receitas
          </span>
          <FileSearch className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {pendingValidation}
          </span>
          <span className="text-[11px] text-purple-700 font-medium">Aguardando</span>
        </div>
      </div>

      {/* 2. Separação */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Em Separação
          </span>
          <PackageCheck className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {inPreparation}
          </span>
          <span className="text-[11px] text-blue-700 font-medium">No Estoque</span>
        </div>
      </div>

      {/* 3. Pronto p/ Coleta */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Pronto p/ Motoboy
          </span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {readyForCourier}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Despacho</span>
        </div>
      </div>

      {/* 4. Em Rota */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Em Rota
          </span>
          <Bike className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{inRoute}</span>
          <span className="text-[11px] text-emerald-700 font-medium">Nas Ruas</span>
        </div>
      </div>

      {/* 5. Entregues */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Entregues Hoje
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{delivered}</span>
          <span className="text-[11px] text-emerald-700 font-medium">100% Baixa</span>
        </div>
      </div>

      {/* 6. Termolábeis */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-2xl border border-cyan-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-cyan-800 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Cadeia de Frio
          </span>
          <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-cyan-900">
            {coldChainCount}
          </span>
          <span className="text-[11px] text-cyan-700 font-medium">2°C a 8°C</span>
        </div>
      </div>
    </div>
  );
};
