'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analytics } from '@/lib/analytics'

const SEGMENTOS = [
  "Contabilidade e Auditoria",
  "Advocacia e Serviços Jurídicos",
  "Marketing e Publicidade",
  "Consultoria Empresarial",
  "Recursos Humanos e Recrutamento",
  "TI e Desenvolvimento de Software",
  "Design e Comunicação Visual",
  "Clínicas e Consultórios Médicos",
  "Odontologia",
  "Estética e Beleza",
  "Farmácias e Drogarias",
  "Academias e Fitness",
  "Construção Civil",
  "Arquitetura e Engenharia",
  "Reformas e Acabamentos",
  "Materiais de Construção",
  "Indústria Alimentícia",
  "Indústria Têxtil e Confecção",
  "Metalurgia e Siderurgia",
  "Plásticos e Embalagens",
  "Máquinas e Equipamentos",
  "Comércio Varejista",
  "Comércio Atacadista",
  "E-commerce e Vendas Online",
  "Distribuidoras",
  "Restaurantes e Bares",
  "Padarias e Confeitarias",
  "Delivery e Food Service",
  "Supermercados e Minimercados",
  "Escolas e Colégios",
  "Cursos e Treinamentos",
  "Educação Infantil",
  "Ensino Superior",
  "Transportadoras",
  "Logística e Armazenagem",
  "Frotas e Veículos",
  "Agricultura",
  "Pecuária",
  "Insumos Agrícolas",
  "Agroindústria",
  "Imobiliárias",
  "Incorporadoras",
  "Administração de Condomínios",
  "Hotéis e Pousadas",
  "Agências de Viagem",
  "Eventos e Entretenimento",
  "Seguros",
  "Crédito e Financiamento",
  "Investimentos",
  "Oficinas e Autopeças",
  "Concessionárias",
  "Estética Automotiva",
  "Energia e Utilities",
  "Telecomunicações",
  "Segurança e Vigilância",
  "Limpeza e Facilities",
  "Pet Shop e Veterinária",
  "Moda e Acessórios",
  "Gráficas e Editoras",
  "Outro Segmento"
]

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estados do formulário (CARGO REMOVIDO)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [segmento, setSegmento] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Capturar UTMs e tracking IDs da URL
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      
      const leadData = {
        nome,
        email,
        telefone,
        segmento,
        utm_source: urlParams?.get('utm_source'),
        utm_medium: urlParams?.get('utm_medium'),
        utm_campaign: urlParams?.get('utm_campaign'),
        utm_content: urlParams?.get('utm_content'),
        fbclid: urlParams?.get('fbclid'),
        gclid: urlParams?.get('gclid')
      }

      console.log('[Lead Data]', leadData)

      // Disparar eventos de conversão para pixels (com await para Google Analytics)
      await analytics.leadCaptured({
        nome,
        email,
        telefone,
        segmento
      })

      // Salvar dados na sessão para o dashboard (CARGO REMOVIDO)
      sessionStorage.setItem('userName', nome)
      sessionStorage.setItem('userEmail', email)
      sessionStorage.setItem('userSegmento', segmento)

      // Evento de trial iniciado (com await)
      await analytics.trialStarted(email, segmento)

      // Simular delay (quando tiver backend, trocar por fetch real)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Quando tiver backend/API, descomentar:
      // const response = await fetch('/api/leads', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(leadData)
      // })
      // if (!response.ok) throw new Error('Erro ao salvar lead')

      // Redirecionar para dashboard
      router.push('/dashboard')

    } catch (err) {
      console.error('Erro ao processar formulário:', err)
      setError('Erro ao processar seu cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TaBombandoAgora
          </h1>
          <a 
            href="/login" 
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Login
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Título Principal - Visível em Mobile */}
        <div className="lg:hidden mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Como obter a lista certa de empresas,{' '}
            <span className="text-blue-600">qualificada e atualizada</span>,{' '}
            para sua prospecção B2B
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Coluna DIREITA em Desktop (ordem 2) = Formulário PRIMEIRO em Mobile (order-1) */}
          <div className="relative order-1 lg:order-2">
            {/* Card com sombra */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              
              {/* Header do card */}
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                  🎁 OFERTA GRATUITA
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Receba Seus 150 Leads Gratuitos
                </h3>
                <p className="text-gray-600">
                  Preencha os dados e comece agora mesmo
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu Nome Completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail Profissional
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@suaempresa.com.br"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone/WhatsApp
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Segmento */}
                <div>
                  <label htmlFor="segmento" className="block text-sm font-semibold text-gray-700 mb-2">
                    Para qual segmento você vende? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="segmento"
                    required
                    value={segmento}
                    onChange={(e) => setSegmento(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  >
                    <option value="">Selecione seu segmento...</option>
                    {SEGMENTOS.map((seg) => (
                      <option key={seg} value={seg}>{seg}</option>
                    ))}
                  </select>
                </div>

                {/* CAMPO CARGO REMOVIDO COMPLETAMENTE */}

                {/* Mensagem de erro */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {/* Botão Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      PROCESSANDO...
                    </span>
                  ) : (
                    'COMEÇAR AGORA SEU TRIAL GRÁTIS'
                  )}
                </button>

                {/* Footer badges */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-3">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <strong>100% Gratuito</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <strong>Sem cartão</strong>
                  </span>
                </div>

                {/* Termos */}
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  Ao se cadastrar, você concorda com nossos{' '}
                  <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a>
                  {' '}e{' '}
                  <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>.
                </p>
              </form>
            </div>

            {/* Elemento decorativo */}
            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          </div>

          {/* Coluna ESQUERDA em Desktop (ordem 1) = Conteúdo DEPOIS em Mobile (order-2) */}
          <div className="space-y-6 order-2 lg:order-1">
            
            {/* Título - Oculto em Mobile (já está no topo) */}
            <h2 className="hidden lg:block text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Como obter a lista certa de empresas,{' '}
              <span className="text-blue-600">qualificada e atualizada</span>,{' '}
              para sua prospecção B2B
            </h2>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Baixar listas prontas costuma gerar frustração: são genéricas, desatualizadas e não mostram quais empresas têm real potencial de compra. Para fazer uma prospecção B2B eficiente, você precisa identificar quem realmente pode comprar de você e construir uma lista baseada em critérios claros.
              </p>

              <p>
                A partir do momento em que você informa seus dados, é direcionado para uma tela onde pode pesquisar empresas e filtrar exatamente o tipo de lead que deseja, usando informações oficiais e atualizadas da Receita Federal. Assim, sua lista deixa de ser "fria" e passa a ser montada com base no seu público ideal.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 pt-4">
                Veja como funciona de forma simples e prática:
              </h3>

              <ol className="space-y-4">
                {/* Passo 1 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Preencha seus dados no formulário:</strong> nome completo, e-mail profissional, WhatsApp e o segmento para o qual você vende. Esse passo libera o acesso à ferramenta.
                    </p>
                  </div>
                </li>

                {/* Passo 2 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Após enviar, você será direcionado para a tela de pesquisa:</strong> nela você pode buscar empresas diretamente ou usar filtros avançados para refinar sua lista.
                    </p>
                  </div>
                </li>

                {/* Passo 3 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Use o filtro de CNAE:</strong> o CNAE mostra a atividade da empresa. Escolher o CNAE certo ajuda você a encontrar apenas empresas que atuam no seu mercado.
                    </p>
                  </div>
                </li>

                {/* Passo 4 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Se quiser ampliar a busca, ative CNAE secundário:</strong> isso mostra empresas que também atuam no seu segmento, mesmo que como atividade adicional.
                    </p>
                  </div>
                </li>

                {/* Passo 5 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Defina localização:</strong> escolha estado e cidade conforme sua área de atuação.
                    </p>
                  </div>
                </li>

                {/* Passo 6 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Ajuste outros filtros conforme seu interesse:</strong> porte, situação da empresa, tipo jurídico, data de abertura e mais.
                    </p>
                  </div>
                </li>

                {/* Passo 7 */}
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>Clique em "Filtrar":</strong> sua lista será gerada com aproximadamente 150 empresas dentro do perfil que você selecionou.
                    </p>
                  </div>
                </li>
              </ol>

              <p className="font-semibold text-blue-600 text-xl pt-4">
                Com acesso a mais de 32 milhões de empresas, você constrói uma lista qualificada, atualizada e pronta para iniciar sua prospecção com muito mais eficiência.
              </p>
            </div>

            {/* Benefícios */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  <strong>32 milhões</strong> de empresas brasileiras na base
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  Dados <strong>atualizados</strong> da Receita Federal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  Filtros avançados por <strong>CNAE, UF, porte</strong> e situação
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 TaBombandoAgora. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-sm mt-2">
            TaBombandoAgora · Prospecção B2B Inteligente
          </p>
        </div>
      </footer>
    </div>
  )
}