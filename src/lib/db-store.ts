import { Order, Medication, Prescription, OrderTrackingEvent } from "./types";
import {
  MOCK_ORDERS,
  MOCK_MEDICATIONS,
  MOCK_PRESCRIPTIONS,
  MOCK_CURRENT_USER,
} from "./mock-data";

// Shared in-memory database store for Next.js API Routes (MVP)
let globalOrders: Order[] = [...MOCK_ORDERS];
let globalMedications: Medication[] = [...MOCK_MEDICATIONS];
let globalPrescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS];

let globalTrackingEvents: OrderTrackingEvent[] = [
  {
    id: "evt-1",
    order_id: "ord-1",
    status: "CRIADO",
    titulo: "Pedido Registrado no SUS",
    descricao: "Pedido criado e enviado para triagem no Polo São Paulo Sul.",
    created_at: "2026-09-15T08:30:00Z",
  },
  {
    id: "evt-2",
    order_id: "ord-1",
    status: "RECEITA_EM_ANALISE",
    titulo: "Receita Médica em Validação",
    descricao: "Farmacêutico responsável iniciou a conferência do CRM e dosagem.",
    created_at: "2026-09-15T08:45:00Z",
  },
  {
    id: "evt-3",
    order_id: "ord-1",
    status: "APROVADO_PREPARACAO",
    titulo: "Receita Aprovada & Medicamento Separado",
    descricao: "Lotes LT-LOS-9982 e LT-INS-2026 conferidos e embalados em caixa térmica.",
    created_at: "2026-09-15T09:15:00Z",
  },
  {
    id: "evt-4",
    order_id: "ord-1",
    status: "EM_ROTA",
    titulo: "Motoboy em Deslocamento",
    descricao: "Entregador Carlos E. (Moto ABC-1234) coletou o pacote e iniciou a rota de entrega.",
    created_at: "2026-09-15T10:15:00Z",
  },
];

export const db = {
  getOrders: (filters?: { status?: string; paciente_id?: string; polo_id?: string }) => {
    let result = [...globalOrders];
    if (filters?.status) {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters?.paciente_id) {
      result = result.filter((o) => o.paciente_id === filters.paciente_id);
    }
    if (filters?.polo_id) {
      result = result.filter((o) => o.polo_origem_id === filters.polo_id);
    }
    return result;
  },

  getOrderById: (id: string) => {
    return globalOrders.find((o) => o.id === id || o.protocolo === id) || null;
  },

  createOrder: (data: Partial<Order>) => {
    const protocolCode = `MOTO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      protocolo: protocolCode,
      paciente_id: data.paciente_id || MOCK_CURRENT_USER.id,
      paciente: data.paciente || MOCK_CURRENT_USER,
      polo_origem_id: data.polo_origem_id || "polo-central-sp-sul",
      prescription_id: data.prescription_id,
      status: "CRIADO",
      endereco_entrega_rua: data.endereco_entrega_rua || MOCK_CURRENT_USER.endereco_rua || "Rua Exemplo",
      endereco_entrega_numero: data.endereco_entrega_numero || MOCK_CURRENT_USER.endereco_numero || "100",
      endereco_entrega_bairro: data.endereco_entrega_bairro || MOCK_CURRENT_USER.endereco_bairro || "Centro",
      endereco_entrega_cidade: data.endereco_entrega_cidade || MOCK_CURRENT_USER.endereco_cidade || "São Paulo",
      endereco_entrega_uf: data.endereco_entrega_uf || MOCK_CURRENT_USER.endereco_uf || "SP",
      endereco_entrega_cep: data.endereco_entrega_cep || MOCK_CURRENT_USER.endereco_cep || "01001-000",
      observacao_paciente: data.observacao_paciente,
      data_previsao_entrega: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      items: data.items || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    globalOrders.unshift(newOrder);

    // Add initial tracking event
    globalTrackingEvents.push({
      id: `evt-${Date.now()}`,
      order_id: newOrder.id,
      status: "CRIADO",
      titulo: "Solicitação Registrada no SUS",
      descricao: "Pedido criado e encaminhado para validação farmacêutica no Polo Central.",
      created_at: new Date().toISOString(),
    });

    return newOrder;
  },

  updateOrderStatus: (
    id: string,
    newStatus: Order["status"],
    extra?: {
      lote?: string;
      justificativa?: string;
      parecer?: string;
      foto_comprovante?: string;
      nome_recebedor?: string;
      documento_recebedor?: string;
    }
  ) => {
    const orderIndex = globalOrders.findIndex((o) => o.id === id || o.protocolo === id);
    if (orderIndex === -1) return null;

    const currentOrder = globalOrders[orderIndex];
    const updatedOrder: Order = {
      ...currentOrder,
      status: newStatus,
      justificativa_recusa: extra?.justificativa || currentOrder.justificativa_recusa,
      updated_at: new Date().toISOString(),
    };

    if (extra?.parecer && updatedOrder.prescription) {
      updatedOrder.prescription = {
        ...updatedOrder.prescription,
        observacoes_farmaceutico: extra.parecer,
        status: newStatus === "RECUSADO" ? "REJEITADA" : "VALIDADA",
      };
    }

    if (extra?.lote && updatedOrder.items.length > 0) {
      updatedOrder.items = updatedOrder.items.map((i) => ({
        ...i,
        lote_atendido: extra.lote || i.lote_atendido,
      }));
    }

    globalOrders[orderIndex] = updatedOrder;

    // Register tracking event
    let eventTitle = `Status atualizado para ${newStatus}`;
    let eventDesc = "Atualização de status registrada no sistema.";

    if (newStatus === "RECEITA_EM_ANALISE") {
      eventTitle = "Receita Médica em Análise";
      eventDesc = "Farmacêutico conferindo CRM do médico e dosagem prescrita.";
    } else if (newStatus === "APROVADO_PREPARACAO") {
      eventTitle = "Receita Aprovada & Em Separação";
      eventDesc = extra?.parecer || "Medicamento separado com baixa no estoque e lote vinculado.";
    } else if (newStatus === "AGUARDANDO_COLETA") {
      eventTitle = "Pacote Selado no Polo";
      eventDesc = "Medicamento pronto e embalado aguardando coleta pelo motoboy credenciado.";
    } else if (newStatus === "EM_ROTA") {
      eventTitle = "Saiu para Entrega (Motoboy a Caminho)";
      eventDesc = "Motoboy retirou o pacote no polo e está em deslocamento até seu endereço.";
    } else if (newStatus === "ENTREGUE") {
      eventTitle = "Medicamento Entregue com Sucesso";
      eventDesc = `Entrega confirmada para ${extra?.nome_recebedor || "o recebedor autorizador"}.`;
    } else if (newStatus === "RECUSADO") {
      eventTitle = "Pedido Recusado pelo Farmacêutico";
      eventDesc = extra?.justificativa || "Receita não atende aos requisitos técnicos da Portaria do SUS.";
    }

    globalTrackingEvents.push({
      id: `evt-${Date.now()}`,
      order_id: updatedOrder.id,
      status: newStatus,
      titulo: eventTitle,
      descricao: eventDesc,
      created_at: new Date().toISOString(),
    });

    return updatedOrder;
  },

  getTrackingEventsByOrderId: (orderId: string) => {
    return globalTrackingEvents.filter((e) => e.order_id === orderId);
  },

  getMedications: (category?: string) => {
    if (category && category !== "ALL") {
      return globalMedications.filter((m) => m.categoria === category);
    }
    return globalMedications;
  },
};
