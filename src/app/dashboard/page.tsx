'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// trocado alias @ por caminhos relativos (sem alterar lógica)
import { LeadCardPreview } from '../../components/lead-card-preview';
import { CNAESearchModal } from '../../components/cnae-search-modal';
import { Lead } from '../../types/lead';

// Lista completa de estados brasileiros
const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

export default function DashboardPage() {
  const router = useRouter();
  const filtrosRef = useRef<HTMLDivElement>(null); // Ref para scroll suave
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userSegmento, setUserSegmento] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [totalResults, setTotalResults] = useState(0);
  
  // Estados dos filtros
  const [showCNAEModal, setShowCNAEModal] = useState(false);
  const [selectedCNAE, setSelectedCNAE] = useState('');
  const [selectedCNAEDesc, setSelectedCNAEDesc] = useState('');
  const [buscarCNAESecundario, setBuscarCNAESecundario] = useState(false);
  const [selectedUF, setSelectedUF] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [selectedSituacao, setSelectedSituacao] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedNatureza, setSelectedNatureza] = useState('');
  const [selectedPorte, setSelectedPorte] = useState('');
  const [selectedCapitalMin, setSelectedCapitalMin] = useState('');
  const [selectedCapitalMax, setSelectedCapitalMax] = useState('');
  const [selectedMEI, setSelectedMEI] = useState<'SIM' | 'NAO' | ''>('');
  const [selectedSimples, setSelectedSimples] = useState('');
  const [selectedTributacao, setSelectedTributacao] = useState('');
  const [dataAberturaInicio, setDataAberturaInicio] = useState('');
  const [dataAberturaFim, setDataAberturaFim] = useState('');
  const [quantidadeFuncionarios, setQuantidadeFuncionarios] = useState('');
  const [faturamentoPresumido, setFaturamentoPresumido] = useState('');
  const [removerContadores, setRemoverContadores] = useState(false);
  
  // Modal de bloqueio
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    // sessionStorage só existe no cliente
    const name = typeof window !== 'undefined' ? sessionStorage.getItem('userName') : null;
    const email = typeof window !== 'undefined' ? sessionStorage.getItem('userEmail') : null;
    const phone = typeof window !== 'undefined' ? sessionStorage.getItem('userPhone') : null;
    const segmento = typeof window !== 'undefined' ? sessionStorage.getItem('userSegmento') : null;
    
    if (!name || !segmento) {
      router.push('/');
      return;
    }

    setUserName(name);
    setUserEmail(email || '');
    setUserPhone(phone || '');
    setUserSegmento(segmento);
    fetchLeads();
  }, [router]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // TODO: Substituir por chamada real à API Railway
      // Simulando 150 leads com mais detalhes
      const mockLeads: Lead[] = Array.from({ length: 150 }, (_, i) => ({
        CNPJ: `${String(10000000 + i).padStart(8, '0')}/0001-${String(i % 100).padStart(2, '0')}`,
        'NATUREZA-JURIDICA': ['Sociedade Empresária Limitada', 'Empresário Individual', 'Sociedade Anônima', 'MEI'][i % 4],
        MEI: i % 5 === 0 ? 'SIM' : 'NAO',
        'SIMPLES-NACIONAL': i % 3 === 0 ? 'SIM' : 'NAO',
        ABERTURA: `${String(2010 + (i % 15))}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
        CAPITAL: String(5000 + (i * 500)),
        EMPRESA: `EMPRESA EXEMPLO ${i + 1} LTDA`,
        TIPO: ['Rua', 'Avenida', 'Praça', 'Alameda'][i % 4],
        LOGRADOURO: ['das Flores', 'dos Bandeirantes', 'Principal', 'Central', 'do Comércio'][i % 5],
        NUMERO: String(100 + (i * 10)),
        COMPLEMENTO: i % 3 === 0 ? `Sala ${i % 20}` : undefined,
        BAIRRO: ['Centro', 'Jardim América', 'Vila Nova', 'Praia do Canto'][i % 4],
        CEP: `${String(29000 + i).padStart(5, '0')}-${String(i % 1000).padStart(3, '0')}`,
        UF: ['SP', 'RJ', 'MG', 'ES', 'BA', 'PR'][i % 6],
        CIDADE: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Vitória', 'Salvador', 'Curitiba'][i % 6],
        TELEFONE: `(${['11', '21', '31', '27', '71', '41'][i % 6]}) 3${String(3000000 + i).substring(0, 7)}`,
        CELULAR: `(${['11', '21', '31', '27', '71', '41'][i % 6]}) 9${String(90000000 + i).substring(0, 8)}`,
        'PROPRIETARIO-SOCIO': `João Silva ${i + 1}`,
        EMAIL: `contato${i + 1}@empresa.com.br`,
        CARGO: ['Diretor', 'Sócio', 'Gerente', 'Proprietário'][i % 4],
        CNAE: ['4711-3/01', '5611-2/01', '6201-5/00', '7020-4/00'][i % 4],
        'CNAE-DESCRICAO': [
          'Comércio varejista de mercadorias em geral',
          'Restaurantes e similares',
          'Desenvolvimento de programas de computador sob encomenda',
          'Atividades de consultoria em gestão empresarial'
        ][i % 4]
      }));
      
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setTotalResults(mockLeads.length);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...leads];

    if (selectedCNAE) {
      filtered = filtered.filter(lead => lead.CNAE === selectedCNAE);
    }

    if (selectedUF) {
      filtered = filtered.filter(lead => lead.UF === selectedUF);
    }

    if (selectedCidade) {
      filtered = filtered.filter(lead => lead.CIDADE === selectedCidade);
    }

    if (selectedNatureza) {
      filtered = filtered.filter(lead => lead['NATUREZA-JURIDICA'] === selectedNatureza);
    }

    if (selectedMEI) {
      filtered = filtered.filter(lead => lead.MEI === selectedMEI);
    }

    // Filtro Simples só aplica se MEI não for "SIM"
    if (selectedMEI !== 'SIM' && selectedSimples) {
      filtered = filtered.filter(lead => lead['SIMPLES-NACIONAL'] === selectedSimples);
    }

    if (dataAberturaInicio) {
      filtered = filtered.filter(lead => lead.ABERTURA && lead.ABERTURA >= dataAberturaInicio);
    }

    if (dataAberturaFim) {
      filtered = filtered.filter(lead => lead.ABERTURA && lead.ABERTURA <= dataAberturaFim);
    }

    if (selectedCapitalMin) {
      filtered = filtered.filter(lead => {
        const capital = parseFloat(lead.CAPITAL || '0');
        return capital >= parseFloat(selectedCapitalMin);
      });
    }

    if (selectedCapitalMax) {
      filtered = filtered.filter(lead => {
        const capital = parseFloat(lead.CAPITAL || '0');
        return capital <= parseFloat(selectedCapitalMax);
      });
    }

    setFilteredLeads(filtered);
    setTotalResults(filtered.length);
    setItemsToShow(6);
  }, [
    selectedCNAE, selectedUF, selectedCidade, selectedNatureza,
    selectedMEI, selectedSimples, dataAberturaInicio, dataAberturaFim,
    selectedCapitalMin, selectedCapitalMax, leads
  ]);

  const handleClearFilters = () => {
    setSelectedCNAE('');
    setSelectedCNAEDesc('');
    setBuscarCNAESecundario(false);
    setSelectedUF('');
    setSelectedCidade('');
    setSelectedSituacao('');
    setSelectedTipo('');
    setSelectedNatureza('');
    setSelectedPorte('');
    setSelectedCapitalMin('');
    setSelectedCapitalMax('');
    setSelectedMEI('');
    setSelectedSimples('');
    setSelectedTributacao('');
    setDataAberturaInicio('');
    setDataAberturaFim('');
    setQuantidadeFuncionarios('');
    setFaturamentoPresumido('');
    setRemoverContadores(false);
  };

  const handleLoadMore = () => {
    setItemsToShow(prev => Math.min(prev + 6, filteredLeads.length));
  };

  const handleUnlockLeads = () => {
    // Salvar dados antes de redirecionar
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('leadsCount', String(filteredLeads.length));
    }
    router.push('/obrigado');
  };

  // Scroll suave até os filtros
  const handleScrollToFilters = () => {
    filtrosRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // Toggle contadores com modal de bloqueio
  const handleToggleContadores = () => {
    if (!removerContadores) {
      setShowBlockModal(true);
    } else {
      setRemoverContadores(false);
    }
  };

  const ufsDisponiveis = ESTADOS_BRASIL;
  const cidadesDisponiveis = selectedUF 
    ? Array.from(new Set(leads.filter(l => l.UF === selectedUF).map(l => l.CIDADE).filter(Boolean))).sort()
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TaBombandoAgora
          </h1>
          <div className="text-sm text-gray-600">
            Olá, <strong>{userName}</strong>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Artigo CNAE */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Você está falando com as empresas certas?{' '}
            <span className="text-blue-600">Descubra com o CNAE</span>
          </h2>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-3">
            <p>
              O <strong>CNAE</strong> (Classificação Nacional de Atividades Econômicas) é um sistema oficial usado no Brasil para identificar e categorizar a atividade principal e as atividades secundárias de uma empresa.
            </p>
            
            <p>
              No contexto da prospecção B2B, entender e usar os CNAEs certos é uma das estratégias mais eficazes para qualificar o público-alvo. Em vez de trabalhar com uma "lista ampla" de contatos genéricos, você pode filtrar empresas exatamente dentro do segmento que mais compra seu produto ou serviço.
            </p>
            
            <p className="font-semibold text-blue-600 text-lg">
              Usar o CNAE como critério de qualificação aumenta drasticamente a precisão da prospecção, reduz custos e melhora a taxa de conversão!
            </p>
          </div>
        </div>

        {/* CTA Destaque - scroll para filtros */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-2xl p-8 mb-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              🎉 {filteredLeads.length} Leads Gratuitos e Qualificados Esperando por Você!
            </h2>
            <p className="text-orange-100 text-lg mb-6">
              Segmento: <strong>{userSegmento}</strong> • Dados completos prontos para uso
            </p>
            <button
              onClick={handleScrollToFilters}
              className="bg-white text-orange-600 font-bold py-4 px-10 rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-lg text-lg transform hover:scale-105"
            >
              LIBERAR MEUS LEADS AGORA
            </button>
          </div>
        </div>

        {/* Painel de Filtros */}
        <div ref={filtrosRef} className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          
          {/* Header do Painel */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              🔍 Filtros Avançados
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpar filtro
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Ramo de Atividade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ramo de atividade [CNAE]
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={selectedCNAE ? `${selectedCNAE} - ${selectedCNAEDesc}` : ''}
                    placeholder="Selecione um CNAE..."
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => setShowCNAEModal(true)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Checkbox com explicação */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={buscarCNAESecundario}
                      onChange={(e) => setBuscarCNAESecundario(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Buscar CNAE secundário</span>
                  </label>
                  <div className="ml-6 flex items-start gap-1.5 bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Empresas podem ter múltiplos CNAEs. Ativar esta opção busca também nas atividades secundárias, 
                      ampliando seus resultados e capturando empresas que atuam no seu segmento mesmo que não seja sua atividade principal.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCNAEModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Quer descobrir o CNAE certo? Clique Aqui
                </button>
              </div>
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Localização
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={selectedUF}
                  onChange={(e) => {
                    setSelectedUF(e.target.value);
                    setSelectedCidade('');
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Selecione um Estado</option>
                  {ufsDisponiveis.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>
                      {uf.sigla} - {uf.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCidade}
                  onChange={(e) => setSelectedCidade(e.target.value)}
                  disabled={!selectedUF}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione uma Cidade</option>
                  {cidadesDisponiveis.map(cidade => (
                    <option key={cidade} value={cidade}>{cidade}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Características */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Características</h4>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Situação */}
                <select
                  value={selectedSituacao}
                  onChange={(e) => setSelectedSituacao(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Situação</option>
                  <option value="02">Ativa</option>
                  <option value="03">Suspensa</option>
                  <option value="04">Inapta</option>
                  <option value="08">Baixada</option>
                </select>

                {/* Tipo */}
                <select
                  value={selectedTipo}
                  onChange={(e) => setSelectedTipo(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Tipo</option>
                  <option value="1">Matriz</option>
                  <option value="2">Filial</option>
                </select>

                {/* Natureza Jurídica */}
                <select
                  value={selectedNatureza}
                  onChange={(e) => setSelectedNatureza(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Natureza jurídica</option>
                  <option value="Sociedade Empresária Limitada">Sociedade Empresária Limitada</option>
                  <option value="Empresário Individual">Empresário Individual</option>
                  <option value="Sociedade Anônima">Sociedade Anônima</option>
                  <option value="MEI">MEI</option>
                </select>

                {/* Porte */}
                <select
                  value={selectedPorte}
                  onChange={(e) => setSelectedPorte(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Porte</option>
                  <option value="01">MEI</option>
                  <option value="03">Microempresa</option>
                  <option value="05">Empresa de Pequeno Porte</option>
                  <option value="00">Demais</option>
                </select>

                {/* Capital Social - Mínimo */}
                <input
                  type="number"
                  value={selectedCapitalMin}
                  onChange={(e) => setSelectedCapitalMin(e.target.value)}
                  placeholder="Capital mínimo"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />

                {/* Capital Social - Máximo */}
                <input
                  type="number"
                  value={selectedCapitalMax}
                  onChange={(e) => setSelectedCapitalMax(e.target.value)}
                  placeholder="Capital máximo"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />

              </div>

              {/* Opção MEI */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Opção pelo MEI
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mei-option"
                      value="SIM"
                      checked={selectedMEI === 'SIM'}
                      onChange={(e) => setSelectedMEI(e.target.value as 'SIM')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mei-option"
                      value="NAO"
                      checked={selectedMEI === 'NAO'}
                      onChange={(e) => setSelectedMEI(e.target.value as 'NAO')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Não</span>
                  </label>
                </div>
              </div>

              {/* Opção Simples (apenas se MEI !== 'SIM') */}
              {selectedMEI !== 'SIM' && (
                <div className="mt-4">
                  <select
                    value={selectedSimples}
                    onChange={(e) => setSelectedSimples(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Opção pelo Simples</option>
                    <option value="SIM">Sim</option>
                    <option value="NAO">Não</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
              )}

            </div>

            {/* Forma de Tributação */}
            <div>
              <select
                value={selectedTributacao}
                onChange={(e) => setSelectedTributacao(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Forma de tributação</option>
                <option value="SIMPLES">Simples Nacional</option>
                <option value="PRESUMIDO">Lucro Presumido</option>
                <option value="REAL">Lucro Real</option>
              </select>
            </div>

            {/* Filtrar - Seção */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Filtrar</h4>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Data de Abertura */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-2">Data de abertura</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dataAberturaInicio}
                      onChange={(e) => setDataAberturaInicio(e.target.value)}
                      placeholder="De"
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="date"
                      value={dataAberturaFim}
                      onChange={(e) => setDataAberturaFim(e.target.value)}
                      placeholder="Até"
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Quantidade de Funcionários */}
                <select
                  value={quantidadeFuncionarios}
                  onChange={(e) => setQuantidadeFuncionarios(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Quantidade de funcionários</option>
                  <option value="0">Sem funcionários</option>
                  <option value="1-5">1 a 5</option>
                  <option value="6-10">6 a 10</option>
                  <option value="11-50">11 a 50</option>
                  <option value="51+">Mais de 50</option>
                </select>

                {/* Faturamento Presumido */}
                <select
                  value={faturamentoPresumido}
                  onChange={(e) => setFaturamentoPresumido(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Faturamento presumido</option>
                  <option value="0-100k">Até R$ 100 mil</option>
                  <option value="100k-500k">R$ 100 mil - R$ 500 mil</option>
                  <option value="500k-1m">R$ 500 mil - R$ 1 milhão</option>
                  <option value="1m+">Acima de R$ 1 milhão</option>
                </select>

              </div>
            </div>

            {/* Toggle Remover Contadores */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={removerContadores}
                    onChange={handleToggleContadores}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Remover contato de contadores</p>
                  <p className="text-xs text-gray-600">Essa opção remove em até 80% os contatos de contadores nas listas</p>
                </div>
              </label>
            </div>

          </div>

          {/* Footer do Painel - Contador */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                Aproximadamente <strong className="text-2xl text-blue-600">{totalResults.toLocaleString('pt-BR')}</strong> resultados
              </p>
              <button
                onClick={handleUnlockLeads}
                disabled={filteredLeads.length === 0}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-8 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Liberar {filteredLeads.length} Leads
              </button>
            </div>
          </div>

        </div>

        {/* Grid de Leads */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Carregando seus leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-md p-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros para ver mais resultados
            </p>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredLeads.slice(0, itemsToShow).map((lead, index) => (
                <LeadCardPreview key={index} lead={lead} />
              ))}
            </div>

            {itemsToShow < filteredLeads.length && (
              <div className="text-center mb-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  Ver Mais Leads ({filteredLeads.length - itemsToShow} restantes)
                </button>
              </div>
            )}

            {itemsToShow >= filteredLeads.length && filteredLeads.length > 0 && (
              <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  🎉 Você viu todos os previews!
                </h4>
                <p className="text-gray-700 mb-6 text-lg">
                  Libere os dados completos (telefones, emails, sócios) para começar a prospectar
                </p>
                <button
                  onClick={handleUnlockLeads}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-10 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  LIBERAR MEUS {filteredLeads.length} LEADS COMPLETOS
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 TaBombandoAgora. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modal CNAE */}
      <CNAESearchModal
        isOpen={showCNAEModal}
        onClose={() => setShowCNAEModal(false)}
        onSelectCNAE={(cnae: string, descricao: string) => {
          setSelectedCNAE(cnae);
          setSelectedCNAEDesc(descricao);
        }}
      />

      {/* Modal de Bloqueio - Remover Contadores */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowBlockModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Recurso Premium
              </h3>
              <p className="text-gray-600 mb-6">
                Este recurso não está disponível para contas em teste grátis. 
                Para utilizar a remoção automática de contadores, adquira um pacote de créditos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/planos';
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ver Planos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}