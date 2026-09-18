"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Building2,
  Bike,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export const DemoSwitcher: React.FC = () => {
  const pathname = usePathname();
  const [minimized, setMinimized] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [stats, setStats] = useState({ total: 3, inRoute: 1, ready: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const json = await res.json();
        const orders = json.data || [];
        setStats({
          total: orders.length,
          inRoute: orders.filter((o: any) => o.status === "EM_ROTA").length,
          ready: orders.filter((o: any) => o.status === "AGUARDANDO_COLETA").length,
        });
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    if (confirm("Deseja resetar os dados do MOTOSUS para o estado inicial da apresentação?")) {
      setResetting(true);
      try {
        await fetch("/api/reset", { method: "POST" });
        window.location.reload();
      } catch (e) {
        alert("Erro ao resetar");
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[95%] sm:w-auto">
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-2 px-3 flex items-center justify-between gap-2 text-white">
        {/* Toggle Minimize on mobile */}
        <button
          onClick={() => setMinimized(!minimized)}
          className="sm:hidden text-slate-400 p-1 hover:text-white"
        >
          {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {!minimized && (
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-center">
            <div className="hidden md:flex items-center gap-1.5 pr-2 border-r border-slate-800 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">Modo Apresentação:</span>
            </div>

            {/* Link Paciente */}
            <Link
              href="/paciente"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/paciente"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>1. Paciente</span>
            </Link>

            {/* Link Farmacêutico */}
            <Link
              href="/farmaceutico"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/farmaceutico"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>2. Farmácia (Kanban)</span>
            </Link>

            {/* Link Entregador */}
            <Link
              href="/entregador"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                pathname === "/entregador"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>3. Motoboy</span>
              {stats.inRoute > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </Link>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={resetting}
              title="Resetar dados do fluxo para reiniciar a apresentação"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 transition-colors"
            >
              <RotateCcw className={`w-3 h-3 ${resetting ? "animate-spin" : ""}`} />
              <span className="hidden lg:inline">Resetar Demo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
