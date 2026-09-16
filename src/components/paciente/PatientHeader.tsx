"use client";

import React from "react";
import Link from "next/link";
import { Bike, ShieldCheck, User as UserIcon, LogOut, ArrowLeft } from "lucide-react";
import { User } from "@/lib/types";
import { formatCPF, formatCNS } from "@/lib/utils";

interface PatientHeaderProps {
  user: User;
  activeTab: "pedidos" | "solicitar" | "receitas";
  setActiveTab: (tab: "pedidos" | "solicitar" | "receitas") => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Banner Gov.br */}
      <div className="bg-[#1351b4] text-white text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider bg-white text-[#1351b4] px-1.5 py-0.5 rounded text-[10px]">
              gov.br
            </span>
            <span className="text-blue-100 font-medium hidden sm:inline">
              Ministério da Saúde • Sistema Único de Saúde (SUS)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-blue-200 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trocar de Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-blue-900 tracking-tight">
                  MOTO<span className="text-emerald-600">SUS</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full uppercase">
                  Paciente
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Polo de Distribuição São Paulo Sul
              </p>
            </div>
          </div>
        </div>

        {/* User identification badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>{user.nome_completo}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-slate-500 text-[11px] flex gap-2">
              <span>CPF: {formatCPF(user.cpf)}</span>
              <span className="text-slate-300">•</span>
              <span>CNS: {user.cartao_sus ? formatCNS(user.cartao_sus) : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-100">
        <button
          onClick={() => setActiveTab("pedidos")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "pedidos"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Meus Pedidos & Rastreio</span>
        </button>

        <button
          onClick={() => setActiveTab("solicitar")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "solicitar"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            +
          </span>
          <span>Solicitar Medicamento</span>
        </button>

        <button
          onClick={() => setActiveTab("receitas")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "receitas"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Minhas Receitas</span>
        </button>
      </div>
    </header>
  );
};
