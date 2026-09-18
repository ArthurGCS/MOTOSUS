"use client";

import React, { useState } from "react";
import {
  Medication,
  Prescription,
  User,
  Order,
} from "@/lib/types";
import {
  Pill,
  UploadCloud,
  FileText,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Send,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface RequestMedicationViewProps {
  user: User;
  availableMedications: Medication[];
  userPrescriptions: Prescription[];
  onOrderCreated: (newOrder: Order) => void;
}

export const RequestMedicationView: React.FC<RequestMedicationViewProps> = ({
  user,
  availableMedications,
  userPrescriptions,
  onOrderCreated,
}) => {
  const [selectedMedications, setSelectedMedications] = useState<
    { medication: Medication; quantidade: number }[]
  >([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>(
    userPrescriptions[0]?.id || ""
  );
  const [newPrescriptionFile, setNewPrescriptionFile] = useState<string | null>(null);
  const [medicoNome, setMedicoNome] = useState("");
  const [medicoCrm, setMedicoCrm] = useState("");
  const [medicoUf, setMedicoUf] = useState("SP");
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);

  const handleAddMedication = (med: Medication) => {
    if (selectedMedications.some((item) => item.medication.id === med.id)) {
      return;
    }
    setSelectedMedications([
      ...selectedMedications,
      { medication: med, quantidade: 30 },
    ]);
  };

  const handleRemoveMedication = (id: string) => {
    setSelectedMedications(
      selectedMedications.filter((item) => item.medication.id !== id)
    );
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setSelectedMedications(
      selectedMedications.map((item) =>
        item.medication.id === id ? { ...item, quantidade: Math.max(1, qty) } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedications.length === 0) {
      alert("Por favor, selecione pelo menos um medicamento.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        paciente_id: user.id,
        paciente: user,
        polo_origem_id: "polo-central-sp-sul",
        prescription_id: selectedPrescriptionId || "presc-nova",
        endereco_entrega_rua: user.endereco_rua || "Rua das Flores",
        endereco_entrega_numero: user.endereco_numero || "250",
        endereco_entrega_bairro: user.endereco_bairro || "Jardim das Palmeiras",
        endereco_entrega_cidade: user.endereco_cidade || "São Paulo",
        endereco_entrega_uf: user.endereco_uf || "SP",
        endereco_entrega_cep: user.endereco_cep || "04567-000",
        observacao_paciente: observacoes,
        items: selectedMedications.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          order_id: `ord-${Date.now()}`,
          medication_id: item.medication.id,
          medication: item.medication,
          quantidade_solicitada: item.quantidade,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onOrderCreated(json.data);
        setSuccessProtocol(json.data.protocolo);
      } else {
        alert(json.error || "Erro ao criar pedido");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de conexão com a API do SUS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successProtocol) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Pedido Solicitado com Sucesso!
        </h3>
        <p className="text-slate-600 text-sm mb-6">
          Seu pedido foi registrado no sistema municipal do SUS e já está na fila do farmacêutico para conferência da receita e lote.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Seu Protocolo de Rastreamento
          </span>
          <span className="text-2xl font-mono font-black text-emerald-700">
            {successProtocol}
          </span>
        </div>

        <button
          onClick={() => {
            setSuccessProtocol(null);
            setSelectedMedications([]);
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-emerald-600/20"
        >
          Acompanhar na Linha do Tempo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Escolha dos Medicamentos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              1. Selecionar Medicamentos do SUS
            </h3>
            <p className="text-xs text-slate-500">
              Escolha os remédios contínuos ou de alto custo cadastrados no seu plano terapêutico
            </p>
          </div>
        </div>

        {/* Lista de Selecionados */}
        {selectedMedications.length > 0 && (
          <div className="mb-6 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Itens no Pedido ({selectedMedications.length})
            </h4>
            {selectedMedications.map((item) => (
              <div
                key={item.medication.id}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200"
              >
                <div>
                  <span className="font-bold text-slate-800 text-sm block">
                    {item.medication.nome_comercial}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.medication.dosagem} • {item.medication.forma_farmaceutica} (CATMAT: {item.medication.codigo_catmat})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Qtd:</span>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={item.quantidade}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.medication.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 text-center border border-slate-300 rounded-lg py-1 px-2 text-sm font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(item.medication.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grade de Medicamentos Disponíveis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableMedications.map((med) => {
            const isSelected = selectedMedications.some(
              (item) => item.medication.id === med.id
            );
            return (
              <button
                key={med.id}
                type="button"
                onClick={() => handleAddMedication(med)}
                disabled={isSelected}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50 opacity-70 cursor-not-allowed"
                    : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                      {med.nome_comercial}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        med.categoria === "ALTO_CUSTO"
                          ? "bg-purple-100 text-purple-700"
                          : med.categoria === "CONTROLADO"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {med.categoria === "ALTO_CUSTO"
                        ? "Alto Custo"
                        : med.categoria === "CONTROLADO"
                        ? "Portaria 344"
                        : "UBS Básica"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {med.principio_ativo} • {med.dosagem}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-700 text-[11px]">
                    Estoque: {med.estoque_disponivel} un
                  </span>
                  <span className="text-blue-600 flex items-center gap-1">
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Adicionado
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Incluir
                      </>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Receita Médica */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              2. Receita Médica Vinculada
            </h3>
            <p className="text-xs text-slate-500">
              Obrigatório para conferência técnica do farmacêutico municipal
            </p>
          </div>
        </div>

        {/* Receitas cadastradas */}
        {userPrescriptions.length > 0 && (
          <div className="space-y-2 mb-4">
            <label className="text-xs font-semibold text-slate-700 block">
              Usar uma receita já validada no seu histórico:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userPrescriptions.map((presc) => (
                <label
                  key={presc.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    selectedPrescriptionId === presc.id
                      ? "border-purple-600 bg-purple-50/40 ring-2 ring-purple-100"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="prescription_select"
                    checked={selectedPrescriptionId === presc.id}
                    onChange={() => {
                      setSelectedPrescriptionId(presc.id);
                      setNewPrescriptionFile(null);
                    }}
                    className="mt-1 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      {presc.medico_nome} (CRM {presc.medico_crm}/{presc.medico_uf_crm})
                    </span>
                    <span className="text-slate-500 text-[11px] block">
                      Válida até: {new Date(presc.data_validade).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {presc.status}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Ou Upload de Nova Receita */}
        <div className="border-t border-slate-100 pt-4 mt-4">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Ou envie uma nova receita médica (Foto ou PDF):
          </label>
          <div
            onClick={() => {
              setNewPrescriptionFile("receita-exemplo-upload.jpg");
              setSelectedPrescriptionId("");
            }}
            className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/20 rounded-xl p-5 text-center cursor-pointer transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-700 block">
              {newPrescriptionFile
                ? `Arquivo anexado: ${newPrescriptionFile}`
                : "Clique para carregar a foto da receita médica"}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Formatos aceitos: JPG, PNG, PDF (Máx. 10MB)
            </span>
          </div>

          {newPrescriptionFile && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <input
                type="text"
                placeholder="Nome do Médico"
                value={medicoNome}
                onChange={(e) => setMedicoNome(e.target.value)}
                className="border border-slate-300 rounded-lg p-2.5 text-xs"
              />
              <input
                type="text"
                placeholder="CRM do Médico"
                value={medicoCrm}
                onChange={(e) => setMedicoCrm(e.target.value)}
                className="border border-slate-300 rounded-lg p-2.5 text-xs"
              />
              <select
                value={medicoUf}
                onChange={(e) => setMedicoUf(e.target.value)}
                className="border border-slate-300 rounded-lg p-2.5 text-xs"
              >
                <option value="SP">SP - São Paulo</option>
                <option value="RJ">RJ - Rio de Janeiro</option>
                <option value="MG">MG - Minas Gerais</option>
                <option value="BA">BA - Bahia</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 3. Endereço e Confirmação */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              3. Endereço de Entrega & Instruções
            </h3>
            <p className="text-xs text-slate-500">
              O motoboy do SUS entregará no endereço vinculado ao seu Cartão SUS
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-xs">
          <p className="font-bold text-slate-800">
            {user.endereco_rua}, {user.endereco_numero} - {user.endereco_bairro}
          </p>
          <p className="text-slate-500">
            {user.endereco_cidade}/{user.endereco_uf} - CEP {user.endereco_cep}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Instruções ou Ponto de Referência para o Motoboy (Opcional):
          </label>
          <textarea
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: Interfone 24, deixar na portaria ou fundos com campainha amarela..."
            className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={isSubmitting || selectedMedications.length === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm transition-all"
      >
        {isSubmitting ? (
          <span>Transmitindo pedido para o SUS...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Confirmar Solicitação de Medicamentos</span>
          </>
        )}
      </button>
    </form>
  );
};
