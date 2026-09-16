-- =====================================================================
-- MOTOSUS - Sistema de Delivery de Medicamentos do SUS
-- Esquema de Banco de Dados PostgreSQL (MVP)
-- =====================================================================

-- Extensões necessárias (UUID para identificadores únicos)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- ENUMS (Domínios de Valores)
-- ---------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'PACIENTE',
    'FARMACEUTICO',
    'ENTREGADOR',
    'ADMIN'
);

CREATE TYPE medication_category AS ENUM (
    'BASICO',        -- Medicamentos de Atenção Básica / UBS
    'ALTO_CUSTO',     -- Medicamentos de Alto Custo / Componente Especializado
    'CONTROLADO'      -- Sujeito a controle especial (Portaria 344)
);

CREATE TYPE prescription_status AS ENUM (
    'PENDENTE_VALIDACAO',
    'VALIDADA',
    'REJEITADA',
    'EXPIRADA'
);

CREATE TYPE order_status AS ENUM (
    'CRIADO',                   -- Pedido realizado pelo paciente
    'RECEITA_EM_ANALISE',       -- Farmácia checando receita / cadastro
    'APROVADO_PREPARACAO',      -- Farmacêutico aprovou e está separando
    'AGUARDANDO_COLETA',        -- Pacote pronto no Polo de Distribuição
    'EM_ROTA',                  -- Entregador coletou e está a caminho
    'ENTREGUE',                 -- Entrega confirmada com sucesso
    'FALHA_ENTREGA',            -- Paciente ausente, endereço não localizado
    'CANCELADO',                -- Cancelado pelo paciente ou sistema
    'RECUSADO'                  -- Recusado pelo farmacêutico (ex: receita inválida)
);

CREATE TYPE delivery_status AS ENUM (
    'PLANEJADA',
    'ACEITA_PELO_MOTOBOY',
    'COLETADA_NO_POLO',
    'EM_DESLOCAMENTO',
    'CONCLUIDA',
    'CANCELADA'
);

-- ---------------------------------------------------------------------
-- 1. TABELA: POLOS DE DISTRIBUIÇÃO E UBSs
-- ---------------------------------------------------------------------
CREATE TABLE polos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    codigo_cnes VARCHAR(20) UNIQUE, -- Código Nacional de Estabelecimentos de Saúde
    endereco_rua VARCHAR(200) NOT NULL,
    endereco_numero VARCHAR(20) NOT NULL,
    endereco_bairro VARCHAR(100) NOT NULL,
    endereco_cidade VARCHAR(100) NOT NULL,
    endereco_uf VARCHAR(2) NOT NULL DEFAULT 'SP',
    endereco_cep VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    telefone VARCHAR(20),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. TABELA: USUÁRIOS (Pacientes, Farmacêuticos, Entregadores, Admins)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cartao_sus VARCHAR(20) UNIQUE, -- CNS (Cartão Nacional de Saúde) - OBRIGATÓRIO p/ pacientes
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE,
    role user_role NOT NULL DEFAULT 'PACIENTE',
    
    -- Vinculação a um Polo (Farmacêuticos ou Entregadores alocados)
    polo_id UUID REFERENCES polos(id) ON DELETE SET NULL,
    
    -- Endereço Padrão do Usuário
    endereco_rua VARCHAR(200),
    endereco_numero VARCHAR(20),
    endereco_complemento VARCHAR(100),
    endereco_bairro VARCHAR(100),
    endereco_cidade VARCHAR(100),
    endereco_uf VARCHAR(2) DEFAULT 'SP',
    endereco_cep VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Perfil complementar do Entregador (Dados da Moto / CNH)
CREATE TABLE driver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    cnh VARCHAR(20) NOT NULL,
    cnh_categoria VARCHAR(5) NOT NULL DEFAULT 'A',
    placa_moto VARCHAR(10) NOT NULL,
    modelo_moto VARCHAR(50) NOT NULL,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    em_rota_ativa BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 3. TABELA: MEDICAMENTOS E ESTOQUE
-- ---------------------------------------------------------------------
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_catmat VARCHAR(30) UNIQUE, -- Catálogo de Materiais do Ministério da Saúde
    nome_comercial VARCHAR(150),
    principio_ativo VARCHAR(150) NOT NULL,
    dosagem VARCHAR(50) NOT NULL,            -- ex: '500mg', '10mg/ml'
    forma_farmaceutica VARCHAR(50) NOT NULL, -- ex: 'Comprimido', 'Xarope', 'Injetável'
    categoria medication_category NOT NULL DEFAULT 'BASICO',
    exige_receita BOOLEAN NOT NULL DEFAULT TRUE,
    temperatura_controlada BOOLEAN NOT NULL DEFAULT FALSE, -- Remédios que necessitam de caixa térmica
    instrucoes_armazenamento TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    polo_id UUID NOT NULL REFERENCES polos(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    lote VARCHAR(50) NOT NULL,
    data_validade DATE NOT NULL,
    quantidade_disponivel INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_disponivel >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (polo_id, medication_id, lote)
);

-- ---------------------------------------------------------------------
-- 4. TABELA: RECEITAS MÉDICAS (Uploads dos Pacientes / Validação Farmacêutica)
-- ---------------------------------------------------------------------
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medico_nome VARCHAR(150) NOT NULL,
    medico_crm VARCHAR(20) NOT NULL,
    medico_uf_crm VARCHAR(2) NOT NULL,
    data_emissao DATE NOT NULL,
    data_validade DATE NOT NULL,
    arquivo_receita_url TEXT NOT NULL,       -- Link de armazenamento (S3, Cloudinary ou local)
    status prescription_status NOT NULL DEFAULT 'PENDENTE_VALIDACAO',
    observacoes_farmaceutico TEXT,
    validado_por UUID REFERENCES users(id),  -- Farmacêutico que validou
    validado_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 5. TABELA: PEDIDOS (Solicitações de Medicamentos)
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocolo VARCHAR(30) UNIQUE NOT NULL,    -- ex: 'MOTO-2026-0915-001'
    paciente_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    polo_origem_id UUID NOT NULL REFERENCES polos(id) ON DELETE RESTRICT,
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'CRIADO',
    
    -- Dados de Entrega para congelamento no momento do pedido
    endereco_entrega_rua VARCHAR(200) NOT NULL,
    endereco_entrega_numero VARCHAR(20) NOT NULL,
    endereco_entrega_complemento VARCHAR(100),
    endereco_entrega_bairro VARCHAR(100) NOT NULL,
    endereco_entrega_cidade VARCHAR(100) NOT NULL,
    endereco_entrega_uf VARCHAR(2) NOT NULL DEFAULT 'SP',
    endereco_entrega_cep VARCHAR(10) NOT NULL,
    latitude_entrega DECIMAL(10, 8),
    longitude_entrega DECIMAL(11, 8),
    
    observacao_paciente TEXT,
    justificativa_recusa TEXT,
    data_previsao_entrega DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Itens de cada Pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
    quantidade_solicitada INTEGER NOT NULL CHECK (quantidade_solicitada > 0),
    quantidade_atendida INTEGER DEFAULT 0 CHECK (quantidade_atendida >= 0),
    lote_atendido VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 6. TABELA: ROTAS E LOGÍSTICA DE ENTREGA (MOTOBOY)
-- ---------------------------------------------------------------------
CREATE TABLE delivery_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_rota VARCHAR(30) UNIQUE NOT NULL, -- ex: 'ROTA-POLO1-20260915-01'
    polo_id UUID NOT NULL REFERENCES polos(id) ON DELETE RESTRICT,
    entregador_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status delivery_status NOT NULL DEFAULT 'PLANEJADA',
    iniciada_em TIMESTAMP WITH TIME ZONE,
    finalizada_em TIMESTAMP WITH TIME ZONE,
    distancia_estimada_km DECIMAL(6, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Associação Pedido <-> Rota (Paradas da Rota)
CREATE TABLE delivery_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES delivery_routes(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    ordem_entrega INTEGER NOT NULL, -- Sequência calculada da rota (1, 2, 3...)
    status order_status NOT NULL DEFAULT 'EM_ROTA',
    
    -- Comprovação da Entrega
    horario_chegada TIMESTAMP WITH TIME ZONE,
    horario_conclusao TIMESTAMP WITH TIME ZONE,
    foto_comprovante_url TEXT,
    assinatura_digital_url TEXT,
    nome_recebedor VARCHAR(150),
    parentesco_ou_tipo VARCHAR(50), -- 'Próprio Paciente', 'Familiar', 'Vizinho Autorizado'
    documento_recebedor VARCHAR(30),
    latitude_confirmacao DECIMAL(10, 8),
    longitude_confirmacao DECIMAL(11, 8),
    motivo_insucesso TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (route_id, order_id)
);

-- ---------------------------------------------------------------------
-- 7. TABELA: HISTÓRICO E RASTREIO (Timeline de Eventos para o Paciente)
-- ---------------------------------------------------------------------
CREATE TABLE order_tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    registrado_por UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- ÍNDICES PARA PERFORMANCE
-- ---------------------------------------------------------------------
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_cartao_sus ON users(cartao_sus);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_orders_paciente ON orders(paciente_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_polo ON orders(polo_origem_id);
CREATE INDEX idx_prescriptions_paciente ON prescriptions(paciente_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_delivery_routes_entregador ON delivery_routes(entregador_id);
CREATE INDEX idx_delivery_stops_route ON delivery_stops(route_id);
CREATE INDEX idx_stock_items_polo_med ON stock_items(polo_id, medication_id);
