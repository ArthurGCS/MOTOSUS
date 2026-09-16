# 🛵 MOTOSUS - Delivery Inteligente de Medicamentos do SUS

> Sistema de centralização e entrega rápida de medicamentos da Atenção Básica (UBS) e Alto Custo (Componente Especializado) pelo Sistema Único de Saúde (SUS), acabando com as filas presenciais nas farmácias municipais.

---

## 📌 Visão Geral da Arquitetura

O **MOTOSUS** conecta três atores essenciais na logística de saúde pública:

1. **Paciente (Cidadão)**:
   - Identificação com dados do SUS e Gov.br (CPF / CNS).
   - Solicitação de medicamentos contínuos e upload de receitas médicas.
   - Acompanhamento em tempo real da entrega com linha do tempo de 6 fases.
   - Gestão de ciclo e cálculo de reposição automática de medicação.

2. **Farmacêutico (Polo Centralizador)**:
   - Fila de triagem estilo **Kanban** (`Triagem de Receita` ➔ `Separação & Lote` ➔ `Pronto p/ Motoboy` ➔ `Em Rota` ➔ `Entregue`).
   - Conferência de CRM do médico prescritor e conformidade sanitária (Portaria 344 / Alto Custo).
   - Baixa no estoque municipal e vinculação de lotes.
   - Monitoramento de medicamentos termolábeis (Cadeia de Frio 2°C a 8°C).

3. **Entregador (Motoboy Credenciado)**:
   - Aceite de rotas centralizadas por bairro/região.
   - Integração com GPS (Google Maps / Waze).
   - Comprovante de entrega digital com foto e assinatura do recebedor.
   - Suporte PWA e fila de sincronização offline para áreas sem sinal de internet.

---

## 🛠️ Stack Tecnológico

- **Frontend / Fullstack**: [Next.js 15 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com identidade visual do SUS
- **Ícones**: [Lucide React](https://lucide.dev/)
- **ORM & Banco de Dados**: [Prisma ORM](https://www.prisma.io/) com [PostgreSQL](https://www.postgresql.org/)
- **Tempo Real**: Server-Sent Events (SSE) nativo
- **Offline / Mobile**: PWA (`manifest.json`) e sincronização resiliente

---

## 🗂️ Estrutura do Projeto

```
MOTOSUS/
├── prisma/
│   └── schema.prisma               # Modelagem Prisma ORM para PostgreSQL
├── public/
│   └── manifest.json               # Manifesto PWA
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── events/route.ts     # SSE para streaming em tempo real
│   │   │   ├── medications/route.ts# Catálogo SUS (CATMAT)
│   │   │   ├── orders/             # Endpoints CRUD e transições de status
│   │   │   └── routes/route.ts     # Logística e rotas dos entregadores
│   │   ├── entregador/page.tsx     # App do Entregador
│   │   ├── farmaceutico/page.tsx   # Dashboard do Farmacêutico (Kanban)
│   │   ├── paciente/page.tsx       # Portal do Paciente
│   │   ├── globals.css             # Estilos globais Tailwind
│   │   ├── layout.tsx              # Root Layout
│   │   └── page.tsx                # Portal de Navegação Central
│   ├── components/
│   │   ├── entregador/             # Componentes de entrega e comprovante
│   │   ├── farmaceutico/           # Kanban, KPIs, Estoque e Modal de Receita
│   │   ├── notifications/          # Simulador de Alertas WhatsApp / SMS
│   │   └── paciente/               # Rastreamento, Catálogo e Refill Automático
│   └── lib/
│       ├── db-store.ts             # Camada de serviço e persistência
│       ├── mock-data.ts            # Fixtures realistas do SUS
│       ├── offline-sync.ts         # Sincronização offline para motoboys
│       ├── prisma.ts               # Prisma Client singleton
│       ├── types.ts                # Definições de tipos TypeScript
│       └── utils.ts                # Formatadores (CPF, CNS) e utilitários
├── schema.sql                      # DDL do PostgreSQL nativo com ENUMs e Índices
├── package.json
└── tailwind.config.ts
```

---

## 🚀 Como Executar Localmente

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/ArthurGCS/MOTOSUS.git
   cd MOTOSUS
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Gere o Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**:
   - Portal Principal: `http://localhost:3000`
   - Portal do Paciente: `http://localhost:3000/paciente`
   - Dashboard Farmácia: `http://localhost:3000/farmaceutico`
   - App do Entregador: `http://localhost:3000/entregador`

---

## 📄 Licença
Distribuído sob a licença MIT. Desenvolvido para modernização dos serviços públicos de saúde.
