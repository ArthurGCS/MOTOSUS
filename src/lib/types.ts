export type UserRole = 'PACIENTE' | 'FARMACEUTICO' | 'ENTREGADOR' | 'ADMIN';

export type MedicationCategory = 'BASICO' | 'ALTO_CUSTO' | 'CONTROLADO';

export type PrescriptionStatus = 'PENDENTE_VALIDACAO' | 'VALIDADA' | 'REJEITADA' | 'EXPIRADA';

export type OrderStatus =
  | 'CRIADO'
  | 'RECEITA_EM_ANALISE'
  | 'APROVADO_PREPARACAO'
  | 'AGUARDANDO_COLETA'
  | 'EM_ROTA'
  | 'ENTREGUE'
  | 'FALHA_ENTREGA'
  | 'CANCELADO'
  | 'RECUSADO';

export type DeliveryStatus =
  | 'PLANEJADA'
  | 'ACEITA_PELO_MOTOBOY'
  | 'COLETADA_NO_POLO'
  | 'EM_DESLOCAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export interface User {
  id: string;
  nome_completo: string;
  email: string;
  cpf: string;
  cartao_sus?: string;
  telefone: string;
  role: UserRole;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_uf?: string;
  endereco_cep?: string;
  polo_id?: string;
}

export interface Medication {
  id: string;
  codigo_catmat?: string;
  nome_comercial?: string;
  principio_ativo: string;
  dosagem: string;
  forma_farmaceutica: string;
  categoria: MedicationCategory;
  exige_receita: boolean;
  temperatura_controlada: boolean;
  estoque_disponivel?: number;
}

export interface Prescription {
  id: string;
  paciente_id: string;
  medico_nome: string;
  medico_crm: string;
  medico_uf_crm: string;
  data_emissao: string;
  data_validade: string;
  arquivo_receita_url: string;
  status: PrescriptionStatus;
  observacoes_farmaceutico?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  medication_id: string;
  medication?: Medication;
  quantidade_solicitada: number;
  quantidade_atendida?: number;
  lote_atendido?: string;
}

export interface Order {
  id: string;
  protocolo: string;
  paciente_id: string;
  paciente?: User;
  polo_origem_id: string;
  prescription_id?: string;
  prescription?: Prescription;
  status: OrderStatus;
  endereco_entrega_rua: string;
  endereco_entrega_numero: string;
  endereco_entrega_bairro: string;
  endereco_entrega_cidade: string;
  endereco_entrega_uf: string;
  endereco_entrega_cep: string;
  observacao_paciente?: string;
  justificativa_recusa?: string;
  data_previsao_entrega?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderTrackingEvent {
  id: string;
  order_id: string;
  status: OrderStatus;
  titulo: string;
  descricao: string;
  created_at: string;
}
