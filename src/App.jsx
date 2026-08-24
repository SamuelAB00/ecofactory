import React, { useState, useEffect, useMemo } from 'react';
import { 
  Factory, 
  LayoutDashboard, 
  Recycle, 
  BarChart3, 
  Settings, 
  Leaf,
  TrendingUp,
  Award,
  PlusCircle,
  Trash2,
  Calendar,
  Package,
  Printer,
  CheckCircle2,
  Building,
  Target,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const INITIAL_EVOLUTION_DATA = [
  { mes: 'Jan', reciclado: 400, metas: 300 },
  { mes: 'Fev', reciclado: 500, metas: 350 },
  { mes: 'Mar', reciclado: 700, metas: 400 },
  { mes: 'Abr', reciclado: 650, metas: 450 },
  { mes: 'Mai', reciclado: 890, metas: 500 },
  { mes: 'Jun', reciclado: 1100, metas: 600 },
];

const CATEGORY_COLORS = {
  'Plástico': '#10b981',
  'Papel/Papelão': '#06b6d4',
  'Metal': '#f59e0b',
  'Vidro': '#6366f1',
};

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [listaResiduos, setListaResiduos] = useState([]);

  const [novoMaterial, setNovoMaterial] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [novoTipo, setNovoTipo] = useState('Plástico');

  const [nomeEmpresa, setNomeEmpresa] = useState('EcoFactory Indústria S.A.');
  const [metaMensal, setMetaMensal] = useState('5000');
  const [notificacao, setNotificacao] = useState(null);

  const mostrarNotificacao = (mensagem) => {
    setNotificacao(mensagem);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const carregarResiduos = () => {
    fetch('http://localhost:3001/api/residuos')
      .then((res) => res.json())
      .then((data) => setListaResiduos(data))
      .catch((err) => console.error('Erro ao carregar resíduos:', err));
  };

  useEffect(() => {
    carregarResiduos();
  }, []);

  const totalReciclado = useMemo(() => {
    return (listaResiduos || []).reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  }, [listaResiduos]);

  const percentualMeta = useMemo(() => {
    const meta = Number(metaMensal) || 1;
    return Math.min(Math.round((totalReciclado / meta) * 100), 100);
  }, [totalReciclado, metaMensal]);

  const dataResiduosGrafico = useMemo(() => {
    const agrupado = (listaResiduos || []).reduce((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + Number(item.quantidade || 0);
      return acc;
    }, {});

    return Object.keys(CATEGORY_COLORS).map(tipo => ({
      name: tipo,
      value: agrupado[tipo] || 0,
      color: CATEGORY_COLORS[tipo]
    }));
  }, [listaResiduos]);

  const handleAdicionarResiduo = async (e) => {
    e.preventDefault();
    if (!novoMaterial || !novaQuantidade || Number(novaQuantidade) <= 0) return;

    try {
      const response = await fetch('http://localhost:3001/api/residuos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material: novoMaterial,
          quantidade: Number(novaQuantidade),
          tipo: novoTipo
        })
      });

      if (response.ok) {
        setNovoMaterial('');
        setNovaQuantidade('');
        carregarResiduos();
        mostrarNotificacao('Lote salvo no banco com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao salvar resíduo:', err);
    }
  };

  const handleDeletarResiduo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/residuos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        carregarResiduos();
        mostrarNotificacao('Lote removido do banco.');
      }
    } catch (err) {
      console.error('Erro ao deletar resíduo:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans print:bg-white print:text-black">
      {notificacao && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all">
          <Check size={18} />
          <span>{notificacao}</span>
        </div>
      )}

      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-8 text-emerald-400">
            <Factory size={32} />
            <h1 className="text-xl font-bold tracking-wide text-white">EcoFactory</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'residuos', label: 'Resíduos', icon: Recycle },
              { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
              { id: 'configuracoes', label: 'Configurações', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAbaAtiva(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  abaAtiva === id 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-center gap-3">
          <Leaf className="text-emerald-400 shrink-0" size={24} />
          <div className="text-xs">
            <p className="font-semibold text-emerald-300">Status Ecológico</p>
            <p className="text-slate-400">{percentualMeta}% Meta atingida</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {abaAtiva === 'dashboard' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold">Painel de Controle</h2>
              <p className="text-slate-400 mt-1">Acompanhe as métricas de reciclagem e metas ESG em tempo real.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">Total Reciclado</p>
                  <p className="text-3xl font-bold mt-2 text-emerald-400">{totalReciclado.toLocaleString()} kg</p>
                  <span className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
                    <TrendingUp size={14} /> +12% este mês
                  </span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Recycle size={24} />
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">Redução de CO₂</p>
                  <p className="text-3xl font-bold mt-2 text-cyan-400">{(totalReciclado * 0.0021).toFixed(1)} Ton</p>
                  <span className="text-xs text-cyan-500 flex items-center gap-1 mt-2">
                    <TrendingUp size={14} /> +8% este mês
                  </span>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Leaf size={24} />
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">Selo de Eficiência</p>
                  <p className="text-3xl font-bold mt-2 text-amber-400">Nível A+</p>
                  <span className="text-xs text-slate-400 mt-2 block">Top 5% das empresas</span>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                  <Award size={24} />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Volume de Reciclagem (kg)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={INITIAL_EVOLUTION_DATA}>
                      <defs>
                        <linearGradient id="colorReciclado" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="mes" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="reciclado" stroke="#10b981" fillOpacity={1} fill="url(#colorReciclado)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between">
                <h3 className="text-lg font-semibold mb-2">Tipos de Resíduos</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataResiduosGrafico}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dataResiduosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  {dataResiduosGrafico.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-400">{item.name} ({item.value} kg)</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {abaAtiva === 'residuos' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold">Gestão de Resíduos</h2>
              <p className="text-slate-400 mt-1">Cadastre novos lotes de resíduos recolhidos e gerencie o estoque.</p>
            </header>

            <form onSubmit={handleAdicionarResiduo} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                <PlusCircle size={20} /> Cadastrar Novo Lote
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Material</label>
                  <input 
                    type="text"
                    placeholder="Ex: Garrafas PET Transparentes"
                    value={novoMaterial}
                    onChange={(e) => setNovoMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Quantidade (kg)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 120"
                    value={novaQuantidade}
                    onChange={(e) => setNovaQuantidade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Material</label>
                  <select 
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(CATEGORY_COLORS).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  <PlusCircle size={18} /> Cadastrar Resíduo
                </button>
              </div>
            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package size={20} className="text-emerald-400" /> Resíduos Cadastrados
                </h3>
                <span className="text-xs text-slate-400">Total: {(listaResiduos || []).length} itens</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Material</th>
                      <th className="py-3 px-6">Categoria</th>
                      <th className="py-3 px-6">Quantidade</th>
                      <th className="py-3 px-6">Data</th>
                      <th className="py-3 px-6 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(listaResiduos || []).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{item.material}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full text-xs border border-slate-700">
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-emerald-400 font-semibold">{item.quantidade} kg</td>
                        <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                          <Calendar size={14} /> {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : ''}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleDeletarResiduo(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Excluir Lote"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'relatorios' && (
          <div className="space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Relatório Sustentável (ESG)</h2>
                <p className="text-slate-400 mt-1">Consolidado mensal de impacto ambiental da {nomeEmpresa}.</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium px-4 py-2.5 rounded-lg text-sm border border-slate-700 transition-all flex items-center gap-2 print:hidden"
              >
                <Printer size={18} /> Imprimir / Salvar PDF
              </button>
            </header>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
              <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">Certificação Ambiental</span>
                  <h3 className="text-xl font-bold text-white mt-1">Balanço do Período - 2026</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Status: Conforme
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400">Total de Resíduos</p>
                  <p className="text-xl font-bold text-white mt-1">{totalReciclado.toLocaleString()} kg</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400">Emissões Evitadas</p>
                  <p className="text-xl font-bold text-cyan-400 mt-1">{(totalReciclado * 0.0021).toFixed(1)} Ton CO₂</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400">Energia Poupada</p>
                  <p className="text-xl font-bold text-amber-400 mt-1">{(totalReciclado * 0.0029).toFixed(1)} MWh</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400">Água Economizada</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{(totalReciclado * 10.6).toLocaleString()} L</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'configuracoes' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold">Configurações do Sistema</h2>
              <p className="text-slate-400 mt-1">Gerencie os dados da organização e parâmetros de reciclagem.</p>
            </header>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Building size={18} className="text-emerald-400" /> Nome da Empresa / Unidade
                </label>
                <input 
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Target size={18} className="text-emerald-400" /> Meta Mensal de Reciclagem (kg)
                </label>
                <input 
                  type="number"
                  value={metaMensal}
                  onChange={(e) => setMetaMensal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button 
                  onClick={() => mostrarNotificacao('Configurações salvas com sucesso!')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}