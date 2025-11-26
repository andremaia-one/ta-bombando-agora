'use client';

import { useState, useEffect } from 'react';
import { CNAESearchModal } from './cnae-search-modal';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface Municipio {
  codigo: string;
  nome: string;
}

export type Filters = {
  modo: "segmento" | "cnpj" | "campo";
  estado?: string;
  cidades?: string[]; // códigos dos municípios
  palavraChave?: string;
  cnaes?: string[];
  cnaeDescricoes?: string[];
  cnpj?: string;
  situacao?: "ATIVA" | "INATIVA" | "";
  porte?: "ME" | "EPP" | "DEMAIS" | "";
  simples?: "SIM" | "NAO" | "";
  mei?: "SIM" | "NAO" | "";
  dataAberturaDe?: string;
  dataAberturaAte?: string;
  funcionariosMin?: number;
  funcionariosMax?: number;
  faturamentoMin?: number;
  faturamentoMax?: number;
  removerContadores?: boolean;
};

// ============================================================================
// HELPER PARA API
// ============================================================================

const API = {
  CONSULTA: (params: { tabela: string; estado?: string; limite?: number }) => {
    const baseUrl = 'https://taondeandaapi-production.up.railway.app/api';
    const { tabela, estado, limite = 1000 } = params;
    
    let url = `${baseUrl}/${tabela}?limit=${limite}`;
    if (estado) {
      url += `&uf=${estado}`;
    }
    return url;
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function LeadFilterForm({
  onApplyFilters,
}: {
  onApplyFilters: (f: Filters) => void;
}) {
  
  // ==========================================================================
  // ESTADOS DO COMPONENTE
  // ==========================================================================
  
  // Modo de busca
  const [modo, setModo] = useState<Filters["modo"]>("segmento");

  // Básicos
  const [estado, setEstado] = useState("");
  const [palavraChave, setPalavraChave] = useState("");
  const [cnpj, setCnpj] = useState("");
  
  // Cidades
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<Municipio[]>([]);
  const [cidadesSelecionadas, setCidadesSelecionadas] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [searchCidade, setSearchCidade] = useState("");

  // CNAE
  const [cnaes, setCnaes] = useState<Array<{codigo: string, descricao: string}>>([]);
  const [showCNAEModal, setShowCNAEModal] = useState(false);

  // Filtros avançados
  const [situacao, setSituacao] = useState<Filters["situacao"]>("");
  const [porte, setPorte] = useState<Filters["porte"]>("");
  const [simples, setSimples] = useState<Filters["simples"]>("");
  const [mei, setMei] = useState<Filters["mei"]>("");
  const [dataAberturaDe, setDataAberturaDe] = useState("");
  const [dataAberturaAte, setDataAberturaAte] = useState("");
  const [funcMin, setFuncMin] = useState(0);
  const [funcMax, setFuncMax] = useState(500);
  const [fatMin, setFatMin] = useState(0);
  const [fatMax, setFatMax] = useState(10_000_000);
  const [removerContadores, setRemoverContadores] = useState(false);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================
  
  // Quando selecionar um estado, buscar as cidades
  useEffect(() => {
    if (estado) {
      console.log(`🔄 Estado selecionado: ${estado} - Buscando cidades...`);
      loadCidadesDoEstado(estado);
    } else {
      console.log('❌ Estado desmarcado - Limpando cidades');
      setCidadesDisponiveis([]);
      setCidadesSelecionadas([]);
    }
  }, [estado]);

  // ==========================================================================
  // FUNÇÃO PRINCIPAL - BUSCAR CIDADES (OTIMIZADA)
  // ==========================================================================
  
  async function loadCidadesDoEstado(uf: string) {
    setLoadingCidades(true);
    console.log(`📍 Iniciando busca de cidades para ${uf}...`);
    
    try {
      // ========================================================================
      // OPÇÃO 1: TENTAR FILTRO DIRETO POR UF (RÁPIDO - 2-5 segundos)
      // ========================================================================
      console.log(`🔍 [OPÇÃO 1] Tentando filtro direto por UF...`);
      
      try {
        const urlDirect = `https://taondeandaapi-production.up.railway.app/api/estabelecimentos?uf=${uf}&limit=50000`;
        const resDirect = await fetch(urlDirect);
        
        if (resDirect.ok) {
          const dataDirect = await resDirect.json();
          
          // Verificar se realmente filtrou por UF
          const todosDoEstado = dataDirect.estabelecimentos?.every((est: any) => est.uf === uf);
          
          if (todosDoEstado && dataDirect.estabelecimentos?.length > 0) {
            console.log(`✅ Filtro direto FUNCIONOU! ${dataDirect.estabelecimentos.length} estabelecimentos`);
            
            // Extrair códigos únicos de município
            const codigosMunicipios = new Set<string>();
            dataDirect.estabelecimentos.forEach((est: any) => {
              if (est.codigo_municipio) {
                codigosMunicipios.add(est.codigo_municipio);
              }
            });
            
            console.log(`📊 ${codigosMunicipios.size} municípios únicos encontrados`);
            
            // Buscar nomes dos municípios
            const cidadesCarregadas: Municipio[] = [];
            const codigosArray = Array.from(codigosMunicipios);
            
            for (const codigo of codigosArray) {
              try {
                const urlMunicipio = `https://taondeandaapi-production.up.railway.app/api/estabelecimentos?codigo_municipio=${codigo}&limit=1`;
                const resMun = await fetch(urlMunicipio);
                const dataMun = await resMun.json();
                
                if (dataMun.estabelecimentos?.[0]?.municipio) {
                  cidadesCarregadas.push({
                    codigo: codigo,
                    nome: dataMun.estabelecimentos[0].municipio
                  });
                }
              } catch (err) {
                console.error(`Erro ao buscar município ${codigo}:`, err);
              }
            }
            
            // Ordenar alfabeticamente
            cidadesCarregadas.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
            
            console.log(`🎉 ${cidadesCarregadas.length} cidades carregadas via filtro direto!`);
            setCidadesDisponiveis(cidadesCarregadas);
            setLoadingCidades(false);
            return; // ← SUCESSO! Sair da função
          } else {
            console.log(`⚠️ Filtro direto retornou dados misturados, tentando paginação...`);
          }
        }
      } catch (errDirect) {
        console.log(`⚠️ Erro no filtro direto:`, errDirect);
      }
      
      // ========================================================================
      // OPÇÃO 2: PAGINAÇÃO COMO FALLBACK (LENTO - 10-20 segundos)
      // ========================================================================
      console.log(`🔄 [OPÇÃO 2] Iniciando busca paginada...`);
      
      let todosEstabelecimentos: any[] = [];
      let pagina = 1;
      const tamanho = 10000;
      let temMais = true;
      
      // Buscar até 10 páginas (100.000 registros)
      while (temMais && pagina <= 10) {
        console.log(`📄 Buscando página ${pagina}/10...`);
        
        const urlPaginada = `https://taondeandaapi-production.up.railway.app/api/estabelecimentos?limit=${tamanho}&offset=${(pagina - 1) * tamanho}`;
        const resPag = await fetch(urlPaginada);
        
        if (!resPag.ok) {
          console.error(`❌ Erro na página ${pagina}`);
          break;
        }
        
        const dataPag = await resPag.json();
        
        if (dataPag.estabelecimentos && dataPag.estabelecimentos.length > 0) {
          todosEstabelecimentos = [...todosEstabelecimentos, ...dataPag.estabelecimentos];
          console.log(`✅ Página ${pagina}: ${dataPag.estabelecimentos.length} registros | Total: ${todosEstabelecimentos.length}`);
          
          temMais = dataPag.estabelecimentos.length === tamanho;
          pagina++;
        } else {
          console.log(`🏁 Página ${pagina} vazia - fim da busca`);
          temMais = false;
        }
      }
      
      console.log(`📊 Total de estabelecimentos buscados: ${todosEstabelecimentos.length}`);
      
      // Filtrar apenas do estado selecionado
      const estabelecimentosDoEstado = todosEstabelecimentos.filter((est: any) => est.uf === uf);
      console.log(`🎯 ${estabelecimentosDoEstado.length} estabelecimentos realmente do ${uf}`);
      
      // Extrair códigos únicos de município
      const codigosMunicipios = new Set<string>();
      estabelecimentosDoEstado.forEach((est: any) => {
        if (est.codigo_municipio) {
          codigosMunicipios.add(est.codigo_municipio);
        }
      });
      
      console.log(`📊 ${codigosMunicipios.size} municípios únicos encontrados`);
      
      // Buscar nomes dos municípios
      const cidadesCarregadas: Municipio[] = [];
      const codigosArray = Array.from(codigosMunicipios);
      
      for (const codigo of codigosArray) {
        try {
          const urlMunicipio = `https://taondeandaapi-production.up.railway.app/api/estabelecimentos?codigo_municipio=${codigo}&limit=1`;
          const resMun = await fetch(urlMunicipio);
          const dataMun = await resMun.json();
          
          if (dataMun.estabelecimentos?.[0]?.municipio) {
            cidadesCarregadas.push({
              codigo: codigo,
              nome: dataMun.estabelecimentos[0].municipio
            });
          }
        } catch (err) {
          console.error(`Erro ao buscar município ${codigo}:`, err);
        }
      }
      
      // Ordenar alfabeticamente
      cidadesCarregadas.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      
      console.log(`🎉 ${cidadesCarregadas.length} cidades carregadas via paginação!`);
      setCidadesDisponiveis(cidadesCarregadas);
      
    } catch (error) {
      console.error('❌ ERRO GERAL ao buscar cidades:', error);
      setCidadesDisponiveis([]);
    } finally {
      setLoadingCidades(false);
    }
  }

  // ==========================================================================
  // HANDLERS
  // ==========================================================================
  
  function handleSelectCNAE(codigo: string, descricao: string) {
    // Evitar duplicatas
    if (!cnaes.find(c => c.codigo === codigo)) {
      setCnaes(prev => [...prev, { codigo, descricao }]);
    }
    setShowCNAEModal(false);
  }

  function removeCnae(codigo: string) {
    setCnaes(prev => prev.filter(c => c.codigo !== codigo));
  }

  function toggleCidade(codigo: string) {
    setCidadesSelecionadas(prev => 
      prev.includes(codigo)
        ? prev.filter(c => c !== codigo)
        : [...prev, codigo]
    );
  }

  function apply() {
    onApplyFilters({
      modo,
      estado: estado || undefined,
      cidades: cidadesSelecionadas.length ? cidadesSelecionadas : undefined,
      palavraChave: palavraChave || undefined,
      cnaes: cnaes.length ? cnaes.map(c => c.codigo) : undefined,
      cnaeDescricoes: cnaes.length ? cnaes.map(c => c.descricao) : undefined,
      cnpj: cnpj || undefined,
      situacao,
      porte,
      simples,
      mei,
      dataAberturaDe: dataAberturaDe || undefined,
      dataAberturaAte: dataAberturaAte || undefined,
      funcionariosMin: funcMin,
      funcionariosMax: funcMax,
      faturamentoMin: fatMin,
      faturamentoMax: fatMax,
      removerContadores,
    });
  }

  function limparFiltros() {
    setModo("segmento");
    setEstado("");
    setPalavraChave("");
    setCnpj("");
    setCidadesDisponiveis([]);
    setCidadesSelecionadas([]);
    setCnaes([]);
    setSituacao("");
    setPorte("");
    setSimples("");
    setMei("");
    setDataAberturaDe("");
    setDataAberturaAte("");
    setFuncMin(0);
    setFuncMax(500);
    setFatMin(0);
    setFatMax(10_000_000);
    setRemoverContadores(false);
  }

  // ==========================================================================
  // FILTRAR CIDADES PELA BUSCA
  // ==========================================================================
  
  const cidadesFiltradas = cidadesDisponiveis.filter(cidade =>
    cidade.nome.toLowerCase().includes(searchCidade.toLowerCase())
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================
  
  return (
    <div className="space-y-6">
      
      {/* Modal de CNAE */}
      {showCNAEModal && (
        <CNAESearchModal
          isOpen={showCNAEModal}
          onClose={() => setShowCNAEModal(false)}
          onSelectCNAE={handleSelectCNAE}
        />
      )}

      {/* Modo de busca */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Modo de busca
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setModo("segmento")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              modo === "segmento"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Por Segmento
          </button>
          <button
            onClick={() => setModo("cnpj")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              modo === "cnpj"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Por CNPJ
          </button>
          <button
            onClick={() => setModo("campo")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              modo === "campo"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Busca Livre
          </button>
        </div>
      </div>

      {/* CNAE */}
      {modo === "segmento" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ramo de Atividade [CNAE]
          </label>
          <button
            onClick={() => setShowCNAEModal(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            + Buscar CNAE
          </button>
          
          {/* CNAEs selecionados */}
          {cnaes.length > 0 && (
            <div className="mt-3 space-y-2">
              {cnaes.map((cnae) => (
                <div
                  key={cnae.codigo}
                  className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg"
                >
                  <span className="text-sm">
                    <strong>{cnae.codigo}</strong> - {cnae.descricao}
                  </span>
                  <button
                    onClick={() => removeCnae(cnae.codigo)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CNPJ */}
      {modo === "cnpj" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CNPJ
          </label>
          <input
            type="text"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Palavra-chave */}
      {modo === "campo" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Palavra-chave
          </label>
          <input
            type="text"
            value={palavraChave}
            onChange={(e) => setPalavraChave(e.target.value)}
            placeholder="Digite uma palavra-chave..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Estado */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Estado (UF)
        </label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecione um estado</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </select>
      </div>

      {/* Cidades */}
      {estado && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cidades {loadingCidades && <span className="text-blue-600">(Carregando...)</span>}
          </label>
          
          {loadingCidades ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Carregando cidades...
            </div>
          ) : cidadesDisponiveis.length > 0 ? (
            <>
              <input
                type="text"
                value={searchCidade}
                onChange={(e) => setSearchCidade(e.target.value)}
                placeholder="Buscar cidade..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                {cidadesFiltradas.map((cidade) => (
                  <label
                    key={cidade.codigo}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={cidadesSelecionadas.includes(cidade.codigo)}
                      onChange={() => toggleCidade(cidade.codigo)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{cidade.nome}</span>
                  </label>
                ))}
                
                {cidadesFiltradas.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">
                    Nenhuma cidade encontrada
                  </p>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                {cidadesSelecionadas.length} cidade(s) selecionada(s) de {cidadesDisponiveis.length} disponíveis
              </p>
            </>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              Selecione um estado para ver as cidades
            </p>
          )}
        </div>
      )}

      {/* Situação */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Situação
        </label>
        <select
          value={situacao}
          onChange={(e) => setSituacao(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas</option>
          <option value="ATIVA">Ativa</option>
          <option value="INATIVA">Inativa</option>
        </select>
      </div>

      {/* Porte */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Porte
        </label>
        <select
          value={porte}
          onChange={(e) => setPorte(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos</option>
          <option value="ME">Microempresa (ME)</option>
          <option value="EPP">Empresa de Pequeno Porte (EPP)</option>
          <option value="DEMAIS">Demais</option>
        </select>
      </div>

      {/* MEI */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Opção pelo MEI
        </label>
        <select
          value={mei}
          onChange={(e) => setMei(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos</option>
          <option value="SIM">Sim</option>
          <option value="NAO">Não</option>
        </select>
      </div>

      {/* Simples Nacional */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Simples Nacional
        </label>
        <select
          value={simples}
          onChange={(e) => setSimples(e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos</option>
          <option value="SIM">Sim</option>
          <option value="NAO">Não</option>
        </select>
      </div>

      {/* Data de Abertura */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Abertura (De)
          </label>
          <input
            type="date"
            value={dataAberturaDe}
            onChange={(e) => setDataAberturaDe(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Abertura (Até)
          </label>
          <input
            type="date"
            value={dataAberturaAte}
            onChange={(e) => setDataAberturaAte(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Remover Contadores */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removerContadores}
            onChange={(e) => setRemoverContadores(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-semibold text-gray-700">
            Remover contadores dos resultados
          </span>
        </label>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={limparFiltros}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Limpar Filtros
        </button>
        <button
          onClick={apply}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}