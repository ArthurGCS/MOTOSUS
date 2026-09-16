"use client";

import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, ArrowLeft, Pill, Bell, AlertTriangle } from "lucide-react";

interface PharmacistHeaderProps {
  poloName: string;
  pharmacistName: string;
  crf: string;
  activeView: "kanban" | "estoque";
  setActiveView: (view: "kanban" | "estoque") => void;
  urgentCount: number;
}

export const PharmacistHeader: React.FC<PharmacistHeaderProps> = ({
  poloName,
  pharmacistName,
  crf,
  activeView,
  setActiveView,
  urgentCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-semibold text-[11px]">
              SISTEMA NACIONAL DE GESTÃO FARMACÊUTICA (HORUS/SUS INTEGRADO)
            </span>
          </div>
          <Link
            href="/"
            className="hover:text-white flex items-center gap-1 text-[11px] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar aos Portais</span>
          </Link>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Polo Info */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                MOTO<span className="text-emerald-400">SUS</span> Farmácia
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Polo Centralizador
              </span>
            </div>
            <p className="text-xs text-slate-400">{poloName}</p>
          </div>
        </div>

        {/* Pharmacist Profile & Alerts */}
        <div className="flex items-center gap-4">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-xl font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{urgentCount} Termolábeis / Alto Custo</span>
            </div>
          )}

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block">{pharmacistName}</span>
              <span className="text-[11px] text-slate-400 font-mono">CRF-SP: {crf}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-3 border-t border-slate-800">
        <button
          onClick={() => setActiveView("kanban")}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeView === "kanban"
              ? "border-emerald-500 text-emerald-400 bg-slate-800/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Quadro Kanban de Despacho</span>
        </button>

        <button
          onClick={() => setActiveView("estoque")}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeView === "estoque"
              ? "border-emerald-500 text-emerald-400 bg-slate-800/40"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Estoque do Polo & Lotes</span>
        </button>
      </div>
    </header>
  );
};
