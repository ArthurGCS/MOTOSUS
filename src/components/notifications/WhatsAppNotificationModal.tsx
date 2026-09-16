"use client";

import React from "react";
import { X, MessageSquare, CheckCheck, Clock, ShieldCheck } from "lucide-react";
import { Order } from "@/lib/types";

interface WhatsAppNotificationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const WhatsAppNotificationModal: React.FC<
  WhatsAppNotificationModalProps
> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111b21] text-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95">
        {/* WhatsApp Top Header */}
        <div className="bg-[#202c33] p-3.5 px-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              SUS
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-slate-100">
                  MOTOSUS Notificações
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                  Oficial
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Conta Comercial Verificada
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 space-y-3 bg-[#0b141a] min-h-[260px] text-xs">
          <div className="text-center">
            <span className="bg-[#182229] text-slate-400 text-[10px] px-2.5 py-1 rounded-md font-medium">
              HOJE
            </span>
          </div>

          <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tl-none max-w-[90%] space-y-2 shadow">
            <p className="font-bold text-emerald-200">
              Olá, {order.paciente?.nome_completo || "Cidadão(ã)"}! 👋
            </p>
            <p className="leading-relaxed">
              Seu pedido de medicamentos pelo **SUS** (Protocolo:{" "}
              <strong className="font-mono text-emerald-100">
                {order.protocolo}
              </strong>
              ) está com status atualizado:
            </p>
            <div className="bg-black/20 p-2 rounded-xl text-[11px] space-y-1">
              <p>
                🛵 <strong>Status:</strong> {order.status}
              </p>
              <p>
                📍 <strong>Destino:</strong> {order.endereco_entrega_bairro},{" "}
                {order.endereco_entrega_cidade}
              </p>
              <p>
                📦 <strong>Itens:</strong> {order.items.length} medicamento(s)
              </p>
            </div>
            <p className="text-[10px] text-emerald-200/80">
              Tenha um documento com foto em mãos ao receber o motoboy credenciado.
            </p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-300/80 pt-1">
              <span>10:15</span>
              <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#202c33] text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mensagem automatizada do Sistema Único de Saúde</span>
        </div>
      </div>
    </div>
  );
};
