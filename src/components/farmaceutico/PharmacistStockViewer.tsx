"use client";

import React, { useState } from "react";
import { Medication } from "@/lib/types";
import {
  Pill,
  Search,
  ThermometerSnowflake,
  ShieldAlert,
  Boxes,
  CheckCircle,
} from "lucide-react";

interface PharmacistStockViewerProps {
  medications: Medication[];
}

export const PharmacistStockViewer: React.FC<PharmacistStockViewerProps> = ({
  medications,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const filtered = medications.filter((m) => {
    const matchesSearch =
      m.nome_comercial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.principio_ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.codigo_catmat?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "ALL" || m.categoria === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-600" />
            Estoque Centralizado do Polo SP Sul
          </h3>
          <p className="text-xs text-slate-500">
            Inventário conectado ao Ministério da Saúde com rastreabilidade de lote e temperatura.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar CATMAT, nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs w-60 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-300 rounded-xl py-2 px-3 text-xs focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="BASICO">Atenção Básica (UBS)</option>
            <option value="ALTO_CUSTO">Alto Custo (Componente Especializado)</option>
            <option value="CONTROLADO">Portaria 344 (Controlados)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">CATMAT</th>
              <th className="py-3 px-4">Medicamento / Princípio Ativo</th>
              <th className="py-3 px-4">Dosagem & Forma</th>
              <th className="py-3 px-4">Categoria SUS</th>
              <th className="py-3 px-4">Cadeia de Frio</th>
              <th className="py-3 px-4 text-right">Saldo em Estoque</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((med) => (
              <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">
                  {med.codigo_catmat || "BR0000000"}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">
                    {med.nome_comercial}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {med.principio_ativo}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-medium text-slate-800">
                    {med.dosagem}
                  </span>
                  <div className="text-[11px] text-slate-400">
                    {med.forma_farmaceutica}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      med.categoria === "ALTO_CUSTO"
                        ? "bg-purple-100 text-purple-800"
                        : med.categoria === "CONTROLADO"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {med.categoria}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {med.temperatura_controlada ? (
                    <span className="inline-flex items-center gap-1 text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      Refrigerado (2°C - 8°C)
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Ambiente</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="font-black text-slate-900 text-sm">
                    {med.estoque_disponivel || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block">unidades</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {(med.estoque_disponivel || 0) > 50 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Regular
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 text-[11px] font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Estoque Baixo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
