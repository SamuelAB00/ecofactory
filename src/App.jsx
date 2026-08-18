import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  LayoutDashboard, 
  Recycle, 
  FileText, 
  Settings, 
  Leaf, 
  Award, 
  TrendingUp, 
  PlusCircle, 
  Trash2 
} from 'lucide-react';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('dashboard');
  const [listaResiduos, setListaResiduos] = useState([]);
  const [material, setMaterial] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [tipo, setTipo] = useState('Plástico');

  const API_URL = 'http://localhost:3001/api/residuos';

  const carregarResiduos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setListaResiduos(data);
      } else {
        setListaResiduos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar resíduos:', error);
      setListaResiduos([]);
    }
  };

  useEffect(() => {
    carregarResiduos();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    if (!material || !quantidade) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material, quantidade: Number(quantidade), tipo }),
      });
      if (res.ok) {
        setMaterial('');
        setQuantidade('');
        carregarResiduos();
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  const handleDeletar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) carregarResiduos();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const totalKg = Array.isArray(listaResiduos)
    ? listaResiduos.reduce((acc, curr) => acc + Number(curr.quantidade || 0), 0)
    : 0;

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar / Menu Lateral */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2 text-emerald-400">
            <BarChart2 size={28} className="text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">EcoFactory</h1>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setTelaAtual('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                telaAtual === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setTelaAtual('residuos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                telaAtual === 'residuos'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Recycle size={18} />
              <span>Resíduos</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <FileText size={18} />
              <span>Relatórios</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
              <Settings size={18} />
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Leaf size={20} />
          </div>
          <div className="text-xs">
            <p className="font-medium text-slate-200">Status Ecológico</p>
            <p className="text-slate-400">85% Meta atingida</p>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {telaAtual === 'dashboard' ? (
          <div className="space-y-6">
            <header>
              <h2 className="text-2xl font-bold text-white">Painel de Controle</h2>
              <p className="text-sm text-slate-400 mt-1">
                Acompanhe as métricas de reciclagem e metas ESG de EcoFactory Indústria S.A..
              </p>
            </header>

            {/* Cards Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-[#0f172a] border border-slate-800/80 rounded-2xl flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Reciclado</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-2">
                    {totalKg.toLocaleString('pt-BR')} kg
                  </p>
                  <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-medium">
                    <TrendingUp size={12} /> +12% este mês
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Recycle size={22} />
                </div>
              </div>

              <div className="p-5 bg-[#0f172a] border border-slate-800/80 rounded-2xl flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-400">Redução de CO₂</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-2">8.9 Ton</p>
                  <p className="text-xs text-cyan-500 mt-2 flex items-center gap-1 font-medium">
                    <TrendingUp size={12} /> +8% este mês
                  </p>
                </div>
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Leaf size={22} />
                </div>
              </div>

              <div className="p-5 bg-[#0f172a] border border-slate-800/80 rounded-2xl flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-400">Meta Mensal</p>
                  <p className="text-2xl font-bold text-amber-400 mt-2">5000 kg</p>
                  <p className="text-xs text-slate-400 mt-2">Definida nas configurações</p>
                </div>
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Award size={22} />
                </div>
              </div>
            </div>

            {/* Seção dos Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Gráfico de Linha */}
              <div className="lg:col-span-2 p-5 bg-[#0f172a] border border-slate-800/80 rounded-2xl flex flex-col justify-between">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Volume de Reciclagem (kg)</h3>
                <div className="h-56 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,110 Q 100,90 200,60 T 400,70 T 500,20 L 500,150 L 0,150 Z"
                      fill="url(#grad)"
                    />
                    <path
                      d="M 0,110 Q 100,90 200,60 T 400,70 T 500,20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
                  <span>Jan</span>
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>Mai</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* Gráfico de Rosca */}
              <div className="p-5 bg-[#0f172a] border border-slate-800/80 rounded-2xl flex flex-col justify-between">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">Tipos de Resíduos</h3>
                <div className="flex-1 flex items-center justify-center py-2">
                  <div className="w-36 h-36 rounded-full border-[14px] border-emerald-500 border-t-cyan-500 border-r-indigo-500 border-b-amber-500"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Plástico
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Papel/Papelão
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Metal
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Vidro
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tela de Resíduos */
          <div className="space-y-6">
            <header>
              <h2 className="text-2xl font-bold text-white">Gestão de Resíduos</h2>
              <p className="text-sm text-slate-400 mt-1">
                Cadastre e gerencie os materiais coletados diretamente no banco de dados.
              </p>
            </header>

            {/* Formulário */}
            <form onSubmit={handleCadastrar} className="p-5 bg-[#0f172a] border border-slate-800/80 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <PlusCircle size={18} /> Cadastrar Novo Lote
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Material (ex: Garrafas PET)"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="bg-[#0b1120] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Quantidade (kg)"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="bg-[#0b1120] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="bg-[#0b1120] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Plástico">Plástico</option>
                  <option value="Papel/Papelão">Papel/Papelão</option>
                  <option value="Metal">Metal</option>
                  <option value="Vidro">Vidro</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                Salvar no Banco
              </button>
            </form>

            {/* Tabela de Itens */}
            <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0b1120] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">ID</th>
                    <th className="py-3.5 px-6">Material</th>
                    <th className="py-3.5 px-6">Tipo</th>
                    <th className="py-3.5 px-6">Quantidade</th>
                    <th className="py-3.5 px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {listaResiduos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-500">
                        Nenhum resíduo cadastrado no PostgreSQL.
                      </td>
                    </tr>
                  ) : (
                    listaResiduos.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-4 px-6 text-slate-500">#{item.id}</td>
                        <td className="py-4 px-6 font-medium text-white">{item.material}</td>
                        <td className="py-4 px-6">{item.tipo}</td>
                        <td className="py-4 px-6 text-emerald-400 font-semibold">
                          {item.quantidade} kg
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeletar(item.id)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}