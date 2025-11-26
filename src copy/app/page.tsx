'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

const SEGMENTOS = [
  'Contabilidade e Auditoria',
  'Advocacia e Serviços Jurídicos',
  'Marketing e Publicidade',
  'Consultoria Empresarial',
  'Recursos Humanos e Recrutamento',
  'TI e Desenvolvimento de Software',
  'Design e Comunicação Visual',
  'Clínicas e Consultórios Médicos',
  'Odontologia',
  'Estética e Beleza',
  'Farmácias e Drogarias',
  'Academias e Fitness',
  'Construção Civil',
  'Arquitetura e Engenharia',
  'Reformas e Acabamentos',
  'Materiais de Construção',
  'Indústria Alimentícia',
  'Indústria Têxtil e Confecção',
  'Metalurgia e Siderurgia',
  'Plásticos e Embalagens',
  'Máquinas e Equipamentos',
  'Comércio Varejista',
  'Comércio Atacadista',
  'E-commerce e Vendas Online',
  'Distribuidoras',
  'Restaurantes e Bares',
  'Padarias e Confeitarias',
  'Delivery e Food Service',
  'Supermercados e Minimercados',
  'Escolas e Colégios',
  'Cursos e Treinamentos',
  'Educação Infantil',
  'Ensino Superior',
  'Transportadoras',
  'Logística e Armazenagem',
  'Frotas e Veículos',
  'Agricultura',
  'Pecuária',
  'Insumos Agrícolas',
  'Agroindústria',
  'Imobiliárias',
  'Incorporadoras',
  'Administração de Condomínios',
  'Hotéis e Pousadas',
  'Agências de Viagem',
  'Eventos e Entretenimento',
  'Seguros',
  'Crédito e Financiamento',
  'Investimentos',
  'Oficinas e Autopeças',
  'Concessionárias',
  'Estética Automotiva',
  'Energia e Utilities',
  'Telecomunicações',
  'Segurança e Vigilância',
  'Limpeza e Facilities',
  'Pet Shop e Veterinária',
  'Moda e Acessórios',
  'Gráficas e Editoras',
  'Outro Segmento',
]

export default function HomePage() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [segmento, setSegmento] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Navegação simples para o dashboard
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaBombandoAgora
            </span>
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
        {/* Título Principal - Mobile */}
        <div className="lg:hidden mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Por que isso não é{' '}
            <span className="text-blue-600">só mais uma lista genérica</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Coluna DIREITA: Formulário */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Header do card */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  ACESSO GRATUITO E IMEDIATO
                </div>
                <h3 className="mt-4 text-2xl font-bold text-gray-900 mb-2">
                  Acesse Agora Seus 150 Leads B2B Segmentados
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Escolha por <strong>CNAE</strong>, <strong>localização</strong>,{' '}
                  <strong>porte</strong> e outros filtros avançados — sem pagar nada.
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu Nome Completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    E-mail Profissional
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@suaempresa.com.br"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Telefone/WhatsApp
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Segmento */}
                <div>
                  <label
                    htmlFor="segmento"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Para qual segmento você vende?{' '}
                    <span className="text-red-500">*</span>
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
                      <option key={seg} value={seg}>
                        {seg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botão */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {loading ? 'PROCESSANDO...' : 'Desbloquear meus 150 contatos agora'}
                </button>
              </form>
            </div>

            {/* Glow decorativo */}
            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl" />
          </div>

          {/* Coluna ESQUERDA: Conteúdo */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Título - Desktop */}
            <h2 className="hidden lg:block text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Por que isso não é{' '}
              <span className="text-blue-600">só mais uma lista genérica</span>
            </h2>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Você não vai baixar um arquivo velho. Vai acessar uma{' '}
                <strong>ferramenta de pesquisa</strong> conectada a dados oficiais da
                Receita Federal, com filtros pensados para prospecção B2B de verdade.
              </p>

              <p>
                Em vez de receber contatos frios e aleatórios, você define o tipo de
                empresa que quer falar — e a ferramenta retorna apenas quem faz sentido
                para o seu funil.
              </p>
            </div>

            {/* Blocos visuais de benefícios */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm border border-blue-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 text-lg">🔎</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Filtros avançados
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Escolha <strong>CNAE</strong>, região, porte, situação cadastral e até
                  data de abertura das empresas.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-indigo-600 text-lg">📊</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Leads na medida certa
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Gere até <strong>150 empresas por pesquisa</strong>, alinhadas ao seu
                  cliente ideal.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-emerald-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <span className="text-emerald-600 text-lg">⏱</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Velocidade prática
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Em menos de <strong>3 minutos</strong>, você tem uma lista pronta para
                  iniciar a prospecção.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-purple-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                    <span className="text-purple-600 text-lg">🧠</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Foco em oportunidade
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Menos lista fria, mais contato com chance real de virar reunião e
                  proposta.
                </p>
              </div>
            </div>

            {/* Benefícios globais */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  <strong>32 milhões</strong> de empresas brasileiras na base
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">
                  Dados <strong>atualizados</strong> da Receita Federal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
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
          <p className="text-gray-400">
            © 2025 TaBombandoAgora. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            TaBombandoAgora · Prospecção B2B Inteligente
          </p>
        </div>
      </footer>
    </div>
  )
}
