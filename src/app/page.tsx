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

const CARGOS = [
  "Proprietário/Sócio",
  "Diretor Comercial",
  "Gerente de Vendas",
  "Vendedor/SDR",
  "Analista de Marketing",
  "Outro"
]

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estados do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [segmento, setSegmento] = useState('')
  const [cargo, setCargo] = useState('')

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
        cargo,
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
        segmento,
        cargo
      })

      // Salvar dados na sessão para o dashboard
      sessionStorage.setItem('userName', nome)
      sessionStorage.setItem('userEmail', email)
      sessionStorage.setItem('userSegmento', segmento)
      sessionStorage.setItem('userCargo', cargo)

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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Coluna Esquerda - Conteúdo */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Prospecção B2B: transforme{' '}
              <span className="text-blue-600">"lista grátis"</span>{' '}
              em clientes reais
            </h2>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Muitos profissionais de vendas ainda acreditam que baixar qualquer lista de empresas 
                ou e-mails gratuitos é o primeiro passo para vender mais. No entanto, na maioria das vezes, 
                são <strong>genéricas, desatualizadas</strong> e sem relação direta com o público que realmente 
                tem interesse em comprar.
              </p>

              <p>
                A verdadeira prospecção B2B começa quando você <strong>entende quem é seu cliente ideal</strong> e 
                como encontrá-lo de forma estratégica. Em vez de perder tempo com contatos desqualificados, 
                é possível usar dados públicos e ferramentas de segmentação para identificar empresas que 
                realmente fazem sentido para o seu negócio.
              </p>

              <p className="font-semibold text-blue-600 text-xl">
                Descubra agora quais empresas realmente têm potencial para comprar de você — gastando 
                nada ou quase nada para vender pra elas.
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

          {/* Coluna Direita - Formulário */}
          <div className="relative">
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

                {/* Cargo - AGORA OBRIGATÓRIO */}
                <div>
                  <label htmlFor="cargo" className="block text-sm font-semibold text-gray-700 mb-2">
                    Qual seu cargo/função? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cargo"
                    required
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  >
                    <option value="">Selecione seu cargo...</option>
                    {CARGOS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

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
                    'COMEÇE AGORA SEU TRIAL GRÁTIS'
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