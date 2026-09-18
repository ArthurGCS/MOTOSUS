"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bike,
  MapPin,
  CheckCircle2,
  Camera,
  Navigation,
  ArrowLeft,
  ShieldCheck,
  ThermometerSnowflake,
  Package,
  X,
  UploadCloud,
  Check,
} from "lucide-react";
import { SignaturePad } from "@/components/entregador/SignaturePad";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { Order, OrderStatus } from "@/lib/types";

export default function EntregadorPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [nomeRecebedor, setNomeRecebedor] = useState("");
  const [docRecebedor, setDocRecebedor] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setOrders(json.data);
        }
      }
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRoute = async (orderId: string) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "EM_ROTA" as OrderStatus } : o
      )
    );

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "EM_ROTA" }),
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulatePhoto = () => {
    setFotoUrl(
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60"
    );
  };

  const handleCompleteDelivery = async () => {
    if (!confirmingOrder) return;
    if (!nomeRecebedor.trim() || !docRecebedor.trim()) {
      alert("Por favor, preencha o nome e documento de quem recebeu o medicamento.");
      return;
    }
    if (!hasSignature) {
      alert("Por favor, colete a assinatura/rubrica do recebedor no quadro digital.");
      return;
    }

    setIsSubmitting(true);

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === confirmingOrder.id
          ? { ...o, status: "ENTREGUE" as OrderStatus }
          : o
      )
    );

    try {
      await fetch(`/api/orders/${confirmingOrder.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "ENTREGUE",
          nome_recebedor: nomeRecebedor,
          documento_recebedor: docRecebedor,
          foto_comprovante: fotoUrl || "foto_comprovante_entregue.jpg",
        }),
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setConfirmingOrder(null);
      setNomeRecebedor("");
      setDocRecebedor("");
      setFotoUrl(null);
      setHasSignature(false);
    }
  };

  const pendingPickup = orders.filter((o) => o.status === "AGUARDANDO_COLETA");
  const inTransit = orders.filter((o) => o.status === "EM_ROTA");
  const completed = orders.filter((o) => o.status === "ENTREGUE");

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      {/* Header Motoboy */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg">
                  MOTO<span className="text-amber-400">SUS</span> Entregas
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase border border-amber-500/30">
                  Em Operação
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Carlos Eduardo • Honda CG 160 Cargo (ABC-1234)
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portais</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Rota Ativa Card */}
        <div className="bg-gradient-to-r from-amber-600/30 to-amber-900/40 border border-amber-500/40 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Rota Centralizada do Dia
            </span>
            <h2 className="text-xl font-black mt-0.5">
              ROTA-POLO-SUL-20260915
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Polo de Saída: UBS Santo Amaro Central • Raio de Entrega: 6.8 km
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Em trânsito</span>
              <span className="font-black text-amber-400 text-base">
                {inTransit.length}
              </span>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">No polo</span>
              <span className="font-black text-blue-400 text-base">
                {pendingPickup.length}
              </span>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px]">Entregues</span>
              <span className="font-black text-emerald-400 text-base">
                {completed.length}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Entregas em Trânsito */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Entregas em Rota Agora ({inTransit.length})
          </h3>

          {inTransit.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
              Nenhuma entrega em trânsito no momento. Colete os pacotes prontos no polo abaixo.
            </div>
          ) : (
            <div className="space-y-4">
              {inTransit.map((order) => {
                const hasColdChain = order.items.some(
                  (i) => i.medication?.temperatura_controlada
                );

                return (
                  <div
                    key={order.id}
                    className="bg-slate-800/90 border-2 border-amber-500/60 rounded-3xl p-5 shadow-xl relative overflow-hidden"
                  >
                    {hasColdChain && (
                      <div className="bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase px-3 py-1 rounded-full absolute top-4 right-4 flex items-center gap-1 shadow">
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        Caixa Térmica (Termolábil)
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                        {order.protocolo}
                      </span>
                      <span className="text-xs text-slate-400">
                        • Parada de Entrega
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white mb-1">
                      {order.paciente?.nome_completo || "Paciente SUS"}
                    </h4>

                    <div className="flex items-start gap-2 text-xs text-slate-300 mb-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">
                          {order.endereco_entrega_rua}, {order.endereco_entrega_numero}
                        </span>
                        <span>
                          {order.endereco_entrega_bairro} • CEP {order.endereco_entrega_cep}
                        </span>
                        {order.observacao_paciente && (
                          <p className="mt-1 text-[11px] text-amber-300 italic">
                            &ldquo;{order.observacao_paciente}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Medicamentos do Pacote */}
                    <div className="text-xs text-slate-400 mb-4 space-y-1">
                      <span className="font-bold text-slate-300 block text-[11px] uppercase">
                        Medicamentos na embalagem lacrada:
                      </span>
                      {order.items.map((it) => (
                        <div key={it.id} className="text-slate-300">
                          • {it.medication?.nome_comercial} ({it.quantidade_solicitada} un)
                          {it.lote_atendido && (
                            <span className="text-slate-500 font-mono ml-2">
                              Lote: {it.lote_atendido}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Ações da Parada */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          `${order.endereco_entrega_rua}, ${order.endereco_entrega_numero}, ${order.endereco_entrega_cidade}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Navigation className="w-4 h-4 text-blue-400" />
                        <span>Abrir GPS (Waze/Maps)</span>
                      </a>

                      <button
                        onClick={() => {
                          setConfirmingOrder(order);
                          setNomeRecebedor(order.paciente?.nome_completo || "");
                          setDocRecebedor(order.paciente?.cpf || "123.456.789-00");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Entrega (Assinatura/Foto)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Prontos no Polo para Retirada */}
        {pendingPickup.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Pacotes Prontos para Retirada no Polo ({pendingPickup.length})
            </h3>

            <div className="space-y-3">
              {pendingPickup.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-400">
                        {order.protocolo}
                      </span>
                      <span className="text-xs text-slate-300 font-bold">
                        {order.paciente?.nome_completo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Bairro: {order.endereco_entrega_bairro} • {order.items.length} medicamento(s)
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartRoute(order.id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md shadow-blue-600/20"
                  >
                    <Bike className="w-4 h-4" />
                    <span>Coletar no Polo & Iniciar Rota</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Comprovação da Entrega com Foto e Assinatura Interativa */}
      {confirmingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-sm">
                  Comprovante Digital de Entrega SUS
                </h3>
              </div>
              <button
                onClick={() => setConfirmingOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-slate-300">
                Protocolo:{" "}
                <strong className="text-white font-mono">
                  {confirmingOrder.protocolo}
                </strong>
              </p>
              <p className="text-slate-300">
                Paciente:{" "}
                <strong className="text-white">
                  {confirmingOrder.paciente?.nome_completo}
                </strong>
              </p>
            </div>

            {/* Inputs de Recebedor */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nome Completo de Quem Recebeu:
                </label>
                <input
                  type="text"
                  placeholder="Nome do recebedor..."
                  value={nomeRecebedor}
                  onChange={(e) => setNomeRecebedor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Documento (RG ou CPF do Recebedor):
                </label>
                <input
                  type="text"
                  placeholder="Ex: 12.345.678-9 ou CPF"
                  value={docRecebedor}
                  onChange={(e) => setDocRecebedor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Foto do Pacote */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Foto do Pacote de Medicamentos no Local:
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  className={`p-3 rounded-xl border flex-1 flex items-center justify-center gap-2 transition-all ${
                    fotoUrl
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="font-bold">
                    {fotoUrl ? "✓ Foto Capturada" : "Simular Foto da Entrega"}
                  </span>
                </button>
              </div>
            </div>

            {/* Signature Pad Interativo */}
            <SignaturePad onSignatureChange={(valid) => setHasSignature(valid)} />

            {/* Botão de Finalização */}
            <div className="pt-3 border-t border-slate-700">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCompleteDelivery}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Registrando Entrega..."
                    : "Registrar Entrega Concluída no SUS"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
