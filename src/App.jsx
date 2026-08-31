import React, { useState, useEffect, useMemo } from 'react';
import { 
  Factory, 
  LayoutDashboard, 
  Recycle, 
  BarChart3, 
  Settings, 
  Leaf,
  TrendingUp,
  PlusCircle,
  Trash2,
  Calendar,
  Package,
  Printer,
  CheckCircle2,
  Building,
  Target,
  Check,
  Cpu,
  Edit,
  Search,
  X,
  ShieldAlert,
  AlertTriangle
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
  const [abaAtiva, setAbaAtiva] = useState(() => {
    return localStorage.getItem('ecoFactory_abaAtiva') || 'dashboard';
  });

  const [listaResiduos, setListaResiduos] = useState([]);
  const [listaMaquinas, setListaMaquinas] = useState([]);
  const [listaOcorrencias, setListaOcorrencias] = useState([]);

  const [buscaMaquina, setBuscaMaquina] = useState('');
  const [buscaResiduo, setBuscaResiduo] = useState('');
  const [buscaOcorrencia, setBuscaOcorrencia] = useState('');

  const [idMaquinaEditando, setIdMaquinaEditando] = useState(null);
  const [nomeMaquina, setNomeMaquina] = useState('');
  const [setorMaquina, setSetorMaquina] = useState('');
  const [tipoMaquina, setTipoMaquina] = useState('Prensa');
  const [statusMaquina, setStatusMaquina] = useState('Operacional');
  const [consumoEnergia, setConsumoEnergia] = useState('');
  const [temperatura, setTemperatura] = useState('');

  const [idResiduoEditando, setIdResiduoEditando] = useState(null);
  const [novoMaterial, setNovoMaterial] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [novoTipo, setNovoTipo] = useState('Plástico');

  const [tipoSST, setTipoSST] = useState('');
  const [descricaoSST, setDescricaoSST] = useState('');
  const [nivelRiscoSST, setNivelRiscoSST] = useState('Baixo');
  const [localSST, setLocalSST] = useState('');
  const [medidaPreventivaSST, setMedidaPreventivaSST] = useState('');

  const [nomeEmpresa, setNomeEmpresa] = useState('EcoFactory Indústria S.A.');
  const [metaMensal, setMetaMensal] = useState('5000');
  const [notificacao, setNotificacao] = useState(null);

  const mostrarNotificacao = (mensagem) => {
    setNotificacao(mensagem);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const handleMudarAba = (idAba) => {
    setAbaAtiva(idAba);
    localStorage.setItem('ecoFactory_abaAtiva', idAba);
  };

  const carregarResiduos = () => {
    fetch('http://localhost:3001/api/residuos')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setListaResiduos(data))
      .catch((err) => console.error(err));
  };

  const carregarMaquinas = () => {
    fetch('http://localhost:3001/api/maquinas')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setListaMaquinas(data))
      .catch((err) => console.error(err));
  };

  const carregarOcorrencias = () => {
    fetch('http://localhost:3001/api/ocorrencias')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setListaOcorrencias(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    carregarResiduos();
    carregarMaquinas();
    carregarOcorrencias();
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

  const maquinasFiltradas = useMemo(() => {
    return (listaMaquinas || []).filter(m => 
      m.nome.toLowerCase().includes(buscaMaquina.toLowerCase()) ||
      m.setor.toLowerCase().includes(buscaMaquina.toLowerCase())
    );
  }, [listaMaquinas, buscaMaquina]);

  const residuosFiltrados = useMemo(() => {
    return (listaResiduos || []).filter(r => 
      r.material.toLowerCase().includes(buscaResiduo.toLowerCase()) ||
      r.tipo.toLowerCase().includes(buscaResiduo.toLowerCase())
    );
  }, [listaResiduos, buscaResiduo]);

  const ocorrenciasFiltradas = useMemo(() => {
    return (listaOcorrencias || []).filter(o => 
      o.tipo.toLowerCase().includes(buscaOcorrencia.toLowerCase()) ||
      o.local.toLowerCase().includes(buscaOcorrencia.toLowerCase()) ||
      o.nivel_risco.toLowerCase().includes(buscaOcorrencia.toLowerCase())
    );
  }, [listaOcorrencias, buscaOcorrencia]);

  const limparFormMaquina = () => {
    setIdMaquinaEditando(null);
    setNomeMaquina('');
    setSetorMaquina('');
    setTipoMaquina('Prensa');
    setStatusMaquina('Operacional');
    setConsumoEnergia('');
    setTemperatura('');
  };

  const prepararEdicaoMaquina = (m) => {
    setIdMaquinaEditando(m.id);
    setNomeMaquina(m.nome);
    setSetorMaquina(m.setor);
    setTipoMaquina(m.tipo);
    setStatusMaquina(m.status);
    setConsumoEnergia(m.consumo_energia);
    setTemperatura(m.temperatura);
  };

  const handleSalvarMaquina = async (e) => {
    e.preventDefault();
    if (!nomeMaquina || !setorMaquina) return;

    const url = idMaquinaEditando 
      ? `http://localhost:3001/api/maquinas/${idMaquinaEditando}`
      : 'http://localhost:3001/api/maquinas';

    const method = idMaquinaEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nomeMaquina,
          setor: setorMaquina,
          tipo: tipoMaquina,
          status: statusMaquina,
          consumo_energia: Number(consumoEnergia || 0),
          temperatura: Number(temperatura || 0)
        })
      });

      if (response.ok) {
        limparFormMaquina();
        carregarMaquinas();
        mostrarNotificacao(idMaquinaEditando ? 'Máquina atualizada!' : 'Máquina cadastrada!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarMaquina = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/maquinas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarMaquinas();
        mostrarNotificacao('Máquina excluída.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const limparFormResiduo = () => {
    setIdResiduoEditando(null);
    setNovoMaterial('');
    setNovaQuantidade('');
    setNovoTipo('Plástico');
  };

  const prepararEdicaoResiduo = (r) => {
    setIdResiduoEditando(r.id);
    setNovoMaterial(r.material);
    setNovaQuantidade(r.quantidade);
    setNovoTipo(r.tipo);
  };

  const handleSalvarResiduo = async (e) => {
    e.preventDefault();
    if (!novoMaterial || !novaQuantidade || Number(novaQuantidade) <= 0) return;

    const url = idResiduoEditando 
      ? `http://localhost:3001/api/residuos/${idResiduoEditando}`
      : 'http://localhost:3001/api/residuos';

    const method = idResiduoEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material: novoMaterial, quantidade: Number(novaQuantidade), tipo: novoTipo })
      });

      if (response.ok) {
        limparFormResiduo();
        carregarResiduos();
        mostrarNotificacao(idResiduoEditando ? 'Resíduo atualizado!' : 'Resíduo cadastrado!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarResiduo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/residuos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarResiduos();
        mostrarNotificacao('Resíduo removido.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSalvarOcorrencia = async (e) => {
    e.preventDefault();
    if (!tipoSST || !descricaoSST || !localSST) return;

    try {
      const response = await fetch('http://localhost:3001/api/ocorrencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoSST,
          descricao: descricaoSST,
          nivel_risco: nivelRiscoSST,
          local: localSST,
          medida_preventiva: medidaPreventivaSST
        })
      });

      if (response.ok) {
        setTipoSST('');
        setDescricaoSST('');
        setLocalSST('');
        setMedidaPreventivaSST('');
        setNivelRiscoSST('Baixo');
        carregarOcorrencias();
        mostrarNotificacao('Ocorrência de Segurança registrada!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarOcorrencia = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/ocorrencias/${id}`, { method: 'DELETE' });
      if (response.ok) {
        carregarOcorrencias();
        mostrarNotificacao('Ocorrência removida.');
      }
    } catch (err) {
      console.error(err);
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
              { id: 'maquinas', label: 'Máquinas', icon: Cpu },
              { id: 'residuos', label: 'Resíduos', icon: Recycle },
              { id: 'sst', label: 'Segurança (SST)', icon: ShieldAlert },
              { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
              { id: 'configuracoes', label: 'Configurações', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleMudarAba(id)}
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
              <p className="text-slate-400 mt-1">Acompanhe as métricas de reciclagem, máquinas e segurança em tempo real.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <p className="text-sm text-slate-400">Máquinas Ativas</p>
                  <p className="text-3xl font-bold mt-2 text-amber-400">
                    {(listaMaquinas || []).filter(m => m.status === 'Operacional').length}
                  </p>
                  <span className="text-xs text-slate-400 mt-2 block">Operacionais no Sistema</span>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                  <Cpu size={24} />
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">Ocorrências SST</p>
                  <p className="text-3xl font-bold mt-2 text-rose-400">{listaOcorrencias.length}</p>
                  <span className="text-xs text-rose-500 flex items-center gap-1 mt-2">
                    <AlertTriangle size={14} /> Registros Abertos
                  </span>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
                  <ShieldAlert size={24} />
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
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
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
                      <Pie data={dataResiduosGrafico} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {dataResiduosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
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

        {abaAtiva === 'maquinas' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold">Gestão de Máquinas</h2>
              <p className="text-slate-400 mt-1">Gerencie, filtre e edite o estado dos equipamentos.</p>
            </header>

            <form onSubmit={handleSalvarMaquina} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  {idMaquinaEditando ? <Edit size={20} /> : <PlusCircle size={20} />}
                  {idMaquinaEditando ? 'Editar Máquina' : 'Cadastrar Nova Máquina'}
                </h3>
                {idMaquinaEditando && (
                  <button 
                    type="button" 
                    onClick={limparFormMaquina} 
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <X size={14} /> Cancelar Edição
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nome da Máquina</label>
                  <input 
                    type="text"
                    placeholder="Ex: Extrusora P1"
                    value={nomeMaquina}
                    onChange={(e) => setNomeMaquina(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Setor</label>
                  <input 
                    type="text"
                    placeholder="Ex: Galpão A"
                    value={setorMaquina}
                    onChange={(e) => setSetorMaquina(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tipo</label>
                  <select 
                    value={tipoMaquina}
                    onChange={(e) => setTipoMaquina(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Prensa">Prensa</option>
                    <option value="Triturador">Triturador</option>
                    <option value="Injetora">Injetora</option>
                    <option value="Extrusora">Extrusora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status Operational</label>
                  <select 
                    value={statusMaquina}
                    onChange={(e) => setStatusMaquina(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Operacional">Operacional</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Desligada">Desligada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Consumo Energia (kWh)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 45.5"
                    value={consumoEnergia}
                    onChange={(e) => setConsumoEnergia(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Temperatura (°C)</label>
                  <input 
                    type="number"
                    placeholder="Ex: 78.0"
                    value={temperatura}
                    onChange={(e) => setTemperatura(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  {idMaquinaEditando ? <Edit size={18} /> : <PlusCircle size={18} />}
                  {idMaquinaEditando ? 'Atualizar Máquina' : 'Cadastrar Máquina'}
                </button>
              </div>
            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Cpu size={20} className="text-emerald-400" /> Máquinas Cadastradas
                </h3>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="text"
                    placeholder="Buscar por nome, setor..."
                    value={buscaMaquina}
                    onChange={(e) => setBuscaMaquina(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Nome</th>
                      <th className="py-3 px-6">Setor / Tipo</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6">Consumo</th>
                      <th className="py-3 px-6">Temperatura</th>
                      <th className="py-3 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {maquinasFiltradas.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{m.nome}</td>
                        <td className="py-4 px-6">
                          <span className="text-slate-300">{m.setor}</span>
                          <span className="text-xs text-slate-500 block">{m.tipo}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            m.status === 'Operacional' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : m.status === 'Manutenção'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-emerald-400 font-medium">{m.consumo_energia || 0} kWh</td>
                        <td className="py-4 px-6 text-slate-300">{m.temperatura || 0} °C</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button 
                            onClick={() => prepararEdicaoMaquina(m)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Editar Máquina"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeletarMaquina(m.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Excluir Máquina"
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

        {abaAtiva === 'residuos' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold">Gestão de Resíduos</h2>
              <p className="text-slate-400 mt-1">Cadastre, edite e filtre lotes de resíduos.</p>
            </header>

            <form onSubmit={handleSalvarResiduo} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  {idResiduoEditando ? <Edit size={20} /> : <PlusCircle size={20} />}
                  {idResiduoEditando ? 'Editar Lote' : 'Cadastrar Novo Lote'}
                </h3>
                {idResiduoEditando && (
                  <button 
                    type="button" 
                    onClick={limparFormResiduo} 
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <X size={14} /> Cancelar Edição
                  </button>
                )}
              </div>

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
                  {idResiduoEditando ? <Edit size={18} /> : <PlusCircle size={18} />}
                  {idResiduoEditando ? 'Atualizar Resíduo' : 'Cadastrar Resíduo'}
                </button>
              </div>
            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package size={20} className="text-emerald-400" /> Resíduos Cadastrados
                </h3>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="text"
                    placeholder="Buscar material ou tipo..."
                    value={buscaResiduo}
                    onChange={(e) => setBuscaResiduo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Material</th>
                      <th className="py-3 px-6">Categoria</th>
                      <th className="py-3 px-6">Quantidade</th>
                      <th className="py-3 px-6">Data</th>
                      <th className="py-3 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {residuosFiltrados.map((item) => (
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
                        <td className="py-4 px-6 text-right space-x-2">
                          <button 
                            onClick={() => prepararEdicaoResiduo(item)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Editar Resíduo"
                          >
                            <Edit size={18} />
                          </button>
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

        {abaAtiva === 'sst' && (
          <div className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold">Saúde e Segurança no Trabalho (SST)</h2>
              <p className="text-slate-400 mt-1">Registre e acompanhe ocorrências de risco e medidas preventivas (Encontro 9).</p>
            </header>

            <form onSubmit={handleSalvarOcorrencia} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                <ShieldAlert size={20} /> Registrar Ocorrência / Risco
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Ocorrência</label>
                  <input 
                    type="text"
                    placeholder="Ex: Vazamento de óleo no piso"
                    value={tipoSST}
                    onChange={(e) => setTipoSST(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Local / Setor</label>
                  <input 
                    type="text"
                    placeholder="Ex: Galpão de Prensas B"
                    value={localSST}
                    onChange={(e) => setLocalSST(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nível de Risco</label>
                  <select 
                    value={nivelRiscoSST}
                    onChange={(e) => setNivelRiscoSST(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Baixo">Baixo</option>
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Descrição detalhada</label>
                  <input 
                    type="text"
                    placeholder="Ex: Óleo acumulado perto do pedal acionador da prensa 02."
                    value={descricaoSST}
                    onChange={(e) => setDescricaoSST(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Medida Preventiva</label>
                  <input 
                    type="text"
                    placeholder="Ex: Limpeza com pó de serra e isolamento."
                    value={medidaPreventivaSST}
                    onChange={(e) => setMedidaPreventivaSST(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2"
                >
                  <PlusCircle size={18} /> Cadastrar Ocorrência
                </button>
              </div>
            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldAlert size={20} className="text-rose-400" /> Histórico de Riscos & Ocorrências
                </h3>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="text"
                    placeholder="Buscar por tipo, local..."
                    value={buscaOcorrencia}
                    onChange={(e) => setBuscaOcorrencia(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Ocorrência</th>
                      <th className="py-3 px-6">Local</th>
                      <th className="py-3 px-6">Nível de Risco</th>
                      <th className="py-3 px-6">Medida Preventiva</th>
                      <th className="py-3 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {ocorrenciasFiltradas.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">
                          {o.tipo}
                          <span className="text-xs text-slate-500 block font-normal">{o.descricao}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-300">{o.local}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            o.nivel_risco === 'Baixo'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : o.nivel_risco === 'Médio'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {o.nivel_risco}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">{o.medida_preventiva || 'Nenhuma'}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleDeletarOcorrencia(o.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Remover Registro"
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
                <h2 className="text-3xl font-bold">Relatório Sustentável (ESG) & Qualidade</h2>
                <p className="text-slate-400 mt-1">Consolidado ambiental e auditoria de qualidade da {nomeEmpresa}.</p>
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
                  onClick={() => mostrarNotificacao('Configurações salvas!')}
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