"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/lib/types";
import { formatCPF, formatCNS } from "@/lib/utils";
import {
  X,
  ShieldCheck,
  FileText,
  User,
  MapPin,
  Pill,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ThermometerSnowflake,
  ExternalLink,
} from "lucide-react";

interface PrescriptionValidationModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderStatus,
    updatedData?: { lote?: string; justificativa?: string; parecer?: string }
  ) => void;
}

export const PrescriptionValidationModal: React.FC<
  PrescriptionValidationModalProps
> = ({ order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const [parecer, setParecer] = useState(
    order.prescription?.observacoes_farmaceutico || ""
  );
  const [lotes, setLotes] = useState<{ [itemId: string]: string }>({
    "item-1": "LT-LOS-9982",
    "item-2": "LT-INS-2026",
    "item-3": "LT-MET-5411",
    "item-4": "LT-SIN-1102",
  });
  const [justificativaRecusa, setJustificativaRecusa] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const handleLoteChange = (itemId: string, val: string) => {
    setLotes({ ...lotes, [itemId]: val });
  };

  const handleAdvanceToPreparation = () => {
    onUpdateStatus(order.id, "APROVADO_PREPARACAO", { parecer });
    onClose();
  };

  const handleAdvanceToReadyForCourier = () => {
    onUpdateStatus(order.id, "AGUARDANDO_COLETA", { parecer });
    onClose();
  };

  const handleAdvanceToInRoute = () => {
    onUpdateStatus(order.id, "EM_ROTA");
    onClose();
  };

  const handleConfirmDelivered = () => {
    onUpdateStatus(order.id, "ENTREGUE");
    onClose();
  };

  const handleReject = () => {
    if (!justificativaRecusa.trim()) {
      alert("Por favor, informe a justificativa técnica para recusa da receita.");
      return;
    }
    onUpdateStatus(order.id, "RECUSADO", { justificativa: justificativaRecusa });
    onClose();
  };

  const hasColdChain = order.items.some(
    (i) => i.medication?.temperatura_controlada
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">
                  Validação Técnica Farmacêutica
                </h3>
                <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  {order.protocolo}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Conferência de Receita, CRM, Lote e Baixa no Estoque SUS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cold Chain Warning if applicable */}
        {hasColdChain && (
          <div className="bg-cyan-50 border-b border-cyan-200 p-3 px-6 flex items-center gap-3 text-xs text-cyan-900">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-700 shrink-0" />
            <span>
              <strong>Atenção Farmacêutica:</strong> Este pedido contém medicamentos termolábeis (ex: Insulina). Exigir caixa térmica selada com gelo reciclável para despacho.
            </span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Patient Details & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Paciente */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                Dados do Cidadão / Paciente
              </h4>
              <p className="font-bold text-slate-900 text-sm">
                {order.paciente?.nome_completo || "Paciente SUS"}
              </p>
              <div className="text-slate-600 mt-1 space-y-0.5">
                <p>CPF: {formatCPF(order.paciente?.cpf || "12345678900")}</p>
                <p>
                  Cartão SUS (CNS):{" "}
                  {order.paciente?.cartao_sus
                    ? formatCNS(order.paciente.cartao_sus)
                    : "748 3920 1823 0001"}
                </p>
                <p>Telefone: {order.paciente?.telefone || "(11) 98765-4321"}</p>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Destino da Rota
              </h4>
              <p className="font-semibold text-slate-900">
                {order.endereco_entrega_rua}, {order.endereco_entrega_numero}
              </p>
              <p className="text-slate-600">
                {order.endereco_entrega_bairro} • {order.endereco_entrega_cidade}/
                {order.endereco_entrega_uf} - CEP {order.endereco_entrega_cep}
              </p>
              {order.observacao_paciente && (
                <p className="mt-1 text-[11px] text-slate-500 italic bg-white p-1.5 rounded border border-slate-200">
                  Obs: &ldquo;{order.observacao_paciente}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Prescription & Doctor CRM Verification */}
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Receita Médica Digitalizada
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                {order.prescription?.status || "VALIDADA"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-purple-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Médico Prescritor
                </span>
                <span className="font-bold text-slate-800">
                  {order.prescription?.medico_nome || "Dra. Camila Vasconcelos"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Registro Profissional
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  CRM {order.prescription?.medico_crm || "189432"}/
                  {order.prescription?.medico_uf_crm || "SP"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Validade do Tratamento
                </span>
                <span className="font-bold text-emerald-700">
                  Até{" "}
                  {order.prescription?.data_validade
                    ? new Date(
                        order.prescription.data_validade
                      ).toLocaleDateString("pt-BR")
                    : "20/02/2027"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-600">
                Conferência de assinatura digital ICP-Brasil e CRM ativo no CFM:
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CRM Ativo & Regular
              </span>
            </div>
          </div>

          {/* Medications & Batch (Lote) Assignment */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              Itens do Pedido & Atribuição de Lote do Estoque
            </h4>

            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {item.medication?.nome_comercial ||
                          item.medication?.principio_ativo}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.medication?.categoria === "ALTO_CUSTO"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.medication?.categoria}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {item.medication?.dosagem} • Qtd Solicitada:{" "}
                      <strong>{item.quantidade_solicitada} un</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Lote do Polo:
                    </span>
                    <input
                      type="text"
                      value={lotes[item.id] || "LT-POLO-2026"}
                      onChange={(e) => handleLoteChange(item.id, e.target.value)}
                      className="border border-slate-300 font-mono font-bold text-slate-800 rounded-lg px-2 py-1 text-xs w-32 bg-slate-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacist Technical Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Parecer Técnico do Farmacêutico (Assinatura Eletrônica no Prontuário):
            </label>
            <textarea
              rows={2}
              value={parecer}
              onChange={(e) => setParecer(e.target.value)}
              placeholder="Ex: Receita conferida. Dosagem e quantidade adequadas ao protocolo clínico do SUS. Dispensação autorizada."
              className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Rejection Form */}
          {isRejecting && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in">
              <label className="text-xs font-bold text-red-900 block mb-1">
                Justificativa Técnica da Recusa (Será enviada ao paciente):
              </label>
              <textarea
                rows={2}
                value={justificativaRecusa}
                onChange={(e) => setJustificativaRecusa(e.target.value)}
                placeholder="Ex: Receita médica com data de validade vencida ou CRM ilegível..."
                className="w-full border border-red-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none bg-white mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow"
                >
                  Confirmar Recusa da Receita
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!isRejecting && (
            <button
              type="button"
              onClick={() => setIsRejecting(true)}
              className="text-red-600 hover:text-red-800 text-xs font-bold py-2 px-3 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <AlertOctagon className="w-4 h-4" />
              Recusar Prescrição
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
            {order.status === "CRIADO" || order.status === "RECEITA_EM_ANALISE" ? (
              <button
                type="button"
                onClick={handleAdvanceToPreparation}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Aprovar & Iniciar Separação
              </button>
            ) : order.status === "APROVADO_PREPARACAO" ? (
              <button
                type="button"
                onClick={handleAdvanceToReadyForCourier}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                Concluir Pacote & Liberar p/ Motoboy
              </button>
            ) : order.status === "AGUARDANDO_COLETA" ? (
              <button
                type="button"
                onClick={handleAdvanceToInRoute}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Despachar com Motoboy (Em Rota)
              </button>
            ) : order.status === "EM_ROTA" ? (
              <button
                type="button"
                onClick={handleConfirmDelivered}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registrar Confirmação de Entrega
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
