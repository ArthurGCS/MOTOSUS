"use client";

import React, { useState } from "react";
import { Calendar, RefreshCw, CheckCircle2, ShieldCheck, Pill } from "lucide-react";

interface AutomaticRefillCardProps {
  onRequestRefill: () => void;
}

export const AutomaticRefillCard: React.FC<AutomaticRefillCardProps> = ({
  onRequestRefill,
}) => {
  const [autoRefillActive, setAutoRefillActive] = useState(true);

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-blue-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Tratamento Contínuo SUS
          </span>
          <span className="text-xs text-blue-200">Ciclo Mensal 30 Dias</span>
        </div>

        <h3 className="text-lg sm:text-xl font-black">
          Renovação Automática: Losartana 50mg & Insulina
        </h3>

        <p className="text-xs text-blue-200/90 max-w-xl leading-relaxed">
          Seu estoque doméstico estimado é suficiente até o dia{" "}
          <strong className="text-white">28 de Setembro</strong>. O MOTOSUS
          agendará a próxima entrega no polo automaticamente para você nunca ficar sem medicação.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
        <button
          onClick={() => setAutoRefillActive(!autoRefillActive)}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
            autoRefillActive
              ? "bg-emerald-600/30 border-emerald-400 text-emerald-300"
              : "bg-slate-800 border-slate-700 text-slate-400"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoRefillActive ? "animate-spin" : ""}`} />
          <span>{autoRefillActive ? "Auto-Renovação Ativa" : "Desativada"}</span>
        </button>

        <button
          onClick={onRequestRefill}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          Antecipar Entrega
        </button>
      </div>
    </div>
  );
};
