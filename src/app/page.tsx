import Link from "next/link";
import { Bike, Building2, User, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 backdrop-blur-md bg-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                MOTO<span className="text-emerald-400">SUS</span>
              </span>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-medium">
                Logística Integrada de Medicamentos SUS
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ambiente Oficial Conectado ao DATASUS (Simulado)</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-6">
          <HeartPulse className="w-4 h-4" />
          Fim das filas na farmácia da UBS e Alto Custo
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Medicamentos do SUS entregues na sua porta com agilidade.
        </h1>
        <p className="mt-5 text-lg text-blue-100/80 max-w-2xl mx-auto font-normal">
          Centralização em polos logísticos, triagem técnica por farmacêuticos e entrega rápida por motoboys credenciados.
        </p>

        {/* Portal Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          {/* Card Paciente */}
          <Link
            href="/paciente"
            className="group relative bg-slate-800/80 hover:bg-slate-800/95 border border-slate-700/80 hover:border-emerald-500/50 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Portal do Paciente</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Acesso via Gov.br ou Cartão SUS. Solicite remédios contínuos, envie fotos da receita e rastreie a rota da moto até sua residência.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <span>Acessar aplicativo</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card Farmacêutico */}
          <Link
            href="/farmaceutico"
            className="group relative bg-slate-800/80 hover:bg-slate-800/95 border border-slate-700/80 hover:border-blue-500/50 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dashboard Farmácia</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Fila de triagem Kanban. Valide prescrições médicas, dê baixa no lote do estoque central e despache os pacotes para os entregadores.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-blue-400 text-sm font-semibold">
              <span>Acessar painel do polo</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card Entregador */}
          <Link
            href="/entregador"
            className="group relative bg-slate-800/80 hover:bg-slate-800/95 border border-slate-700/80 hover:border-amber-500/50 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">App do Entregador</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Aceite rotas agrupadas por bairro no polo central, confira coletas e realize a confirmação digital com foto e assinatura do recebedor.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-amber-400 text-sm font-semibold">
              <span>Acessar rotas</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer Features */}
      <section className="border-t border-white/10 bg-black/20 py-8 px-6 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Validação de CRM e conformidade com Portaria 344</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Rastreio de temperatura para medicamentos termolábeis</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Comprovante digital com assinatura e foto georreferenciada</span>
          </div>
        </div>
      </section>
    </main>
  );
}
