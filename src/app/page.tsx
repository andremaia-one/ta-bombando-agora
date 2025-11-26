'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Target, 
  Zap, 
  Shield, 
  CheckCircle2, 
  TrendingUp,
  Users,
  Award,
  Clock,
  Database,
  Filter,
  Download,
  Mail,
  MessageCircle
} from 'lucide-react'

type FormData = {
  nome: string
  email: string
  telefone: string
  segmento: string
}

const SEGMENTOS = [
  'Construtoras e incorporadoras',
  'Clínicas, consultórios e saúde',
  'Indústrias e fábricas',
  'Varejo, lojas e franquias',
  'Serviços corporativos (B2B)',
  'Tecnologia, software e startups',
  'Educação, cursos e treinamentos',
  'Transportes, logística e distribuição',
  'Agronegócio e insumos',
  'Financeiro, seguros e contabilidade',
]

const LIMITE_SEMANA = 300

export default function HomePage() {
  const router = useRouter()

  const [form, setForm] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    segmento: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usadosSemana, setUsadosSemana] = useState<number>(0)
  const [animatedStats, setAnimatedStats] = useState({
    empresas: 0,
    profissionais: 0,
    conversao: 0
  })

  useEffect(() => {
    // Simulação de acessos usados
    const base = 230
    const variacao = Math.floor(Math.random() * 40)
    const valor = Math.min(base + variacao, LIMITE_SEMANA - 5)
    setUsadosSemana(valor)

    // Animação dos números
    const targets = { empresas: 32000000, profissionais: 9700, conversao: 87 }
    const duration = 2000
    const steps = 60
    const increment = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedStats({
        empresas: Math.floor(targets.empresas * progress),
        profissionais: Math.floor(targets.profissionais * progress),
        conversao: Math.floor(targets.conversao * progress)
      })

      if (currentStep >= steps) clearInterval(timer)
    }, increment)

    return () => clearInterval(timer)
  }, [])

  function handleChange(campo: keyof FormData, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function emailValido(email: string) {
    return /\S+@\S+\.\S+/.test(email)
  }

  function telefoneValido(tel: string) {
    const apenasDigitos = tel.replace(/\D/g, '')
    return apenasDigitos.length >= 10
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.nome || !form.email || !form.telefone || !form.segmento) {
      setError('Preencha todos os campos para liberar seus 150 leads segmentados.')
      return
    }

    if (!emailValido(form.email)) {
      setError('Informe um e-mail profissional válido.')
      return
    }

    if (!telefoneValido(form.telefone)) {
      setError('Informe um telefone/WhatsApp válido com DDD.')
      return
    }

    try {
      setIsSubmitting(true)

      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      let data: any = null
      try {
        data = await resp.json()
      } catch {
        // se não vier JSON, deixa data como null
      }

      // Lead já cadastrado
      if (resp.status === 409) {
        setError('Você já tem cadastro. Faça login para acessar seu painel.')
        return
      }

      // Outros erros (400, 500, etc.)
      if (!resp.ok) {
        const msg =
          data?.error ||
          'Falha ao salvar seus dados. Tente novamente em alguns instantes.'
        setError(msg)
        throw new Error(msg)
      }

      // Sucesso (201)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userName', form.nome)
        sessionStorage.setItem('userEmail', form.email)
        sessionStorage.setItem('userPhone', form.telefone)
        sessionStorage.setItem('userSegmento', form.segmento)
      }

      router.push('/dashboard')
    } catch (err: any) {
      console.error('[ERRO LEAD]', err)
      setError(err.message || 'Erro ao enviar seus dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para scroll suave até o formulário com offset (por causa do header sticky)
const scrollToForm = () => {
  if (typeof window === 'undefined') return

  const formElement = document.getElementById('formulario')
  if (!formElement) return

  // altura aproximada do header (ajuste fino se quiser)
  const OFFSET = 96 // em px, pode testar 80, 96 ou 112

  const rect = formElement.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  const targetY = rect.top + scrollTop - OFFSET

  window.scrollTo({
    top: targetY,
    behavior: 'smooth',
  })
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052CC] to-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  TáBombandoAgora
                </h1>
                <p className="text-xs text-slate-500">Prospecção B2B Inteligente</p>
              </div>
            </div>
            <button className="text-sm font-medium text-[#0052CC] hover:text-blue-700 transition-colors">
              Fazer Login
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION COM GRADIENTE */}
      <section className="relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0052CC]/5 via-transparent to-orange-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0052CC]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge Atualizado */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              9.700 usuários satisfeitos — e aumentando!
            </div>

            {/* Título Principal - FIX para "genéricas" não ser cortado */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block text-slate-900 mb-2">
                Pare de comprar
              </span>
              <span className="block bg-gradient-to-r from-[#0052CC] to-blue-600 bg-clip-text text-transparent pb-2">
                listas genéricas
              </span>
            </h1>

            {/* Subtítulo Atualizado */}
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transforme sua prospecção B2B: gere listas segmentadas da base oficial da Receita Federal em 3 minutos.
              {' '}<span className="font-semibold text-slate-900">Filtre por CNAE, localização, porte e faturamento</span>{' '}
              — e comece agora.
            </p>

            {/* CTA Principal com Scroll Suave */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={scrollToForm}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Quero meus 150 contatos grátis
              </button>
              <a 
                href="#como-funciona"
                className="inline-flex items-center gap-2 px-6 py-3 text-slate-700 font-medium hover:text-[#0052CC] transition-colors"
              >
                Ver como funciona
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Stats Animados */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0052CC]">
                  {(animatedStats.empresas / 1000000).toFixed(0)}M+
                </div>
                <div className="text-sm text-slate-600 mt-1">Empresas na base</div>
              </div>
              <div className="text-center border-x border-slate-200">
                <div className="text-3xl md:text-4xl font-bold text-[#0052CC]">
                  {animatedStats.profissionais.toLocaleString('pt-BR')}+
                </div>
                <div className="text-sm text-slate-600 mt-1">Profissionais ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0052CC]">
                  {animatedStats.conversao}%
                </div>
                <div className="text-sm text-slate-600 mt-1">Taxa de conversão</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS COM ÍCONES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Por que não é "só mais uma lista"
            </h2>
            <p className="text-lg text-slate-600">
              Ferramenta profissional de prospecção B2B com filtros avançados que economizam semanas de trabalho
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052CC] to-blue-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Filtros Avançados por CNAE
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Escolha empresas por atividade econômica específica, localização exata, porte e faturamento. Sem listas genéricas.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Base da Receita Federal
              </h3>
              <p className="text-slate-600 leading-relaxed">
                32+ milhões de empresas com dados atualizados direto da fonte oficial. Informações confiáveis e verificadas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Lista pronta em 3 minutos
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Não perca tempo pesquisando manualmente. Configure seus filtros e baixe até 150 empresas segmentadas instantaneamente.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Público Ideal Alinhado
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Receba apenas empresas que fazem sentido para seu produto, funil e ticket médio. Zero desperdício.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Export em CSV/Excel
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Baixe sua lista e importe direto no seu CRM, ferramenta de e-mail ou sistema de cadência de vendas.
              </p>
            </div>

            {/* Card 6 */}
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                100% Seguro e Gratuito
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Sem cartão de crédito, sem pegadinha. Seus dados protegidos e nunca compartilhados com terceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA - ATUALIZADO COM 4 STEPS */}
      <section id="como-funciona" className="py-16 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-slate-600">
              Simples, rápido e sem complicação. Veja como gerar sua lista perfeita em 4 passos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Linha conectora - apenas desktop */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0052CC] via-emerald-500 via-orange-500 to-rose-500" />

            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#0052CC] to-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/50">
                  <span className="text-3xl md:text-4xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                  Preencha o formulário
                </h3>
                <p className="text-sm md:text-base text-slate-600">
                  Informe seu nome, e-mail e segmento. Levamos sua prospecção tão a sério quanto você leva seu negócio.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/50">
                  <span className="text-3xl md:text-4xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                  Configure seus filtros
                </h3>
                <p className="text-sm md:text-base text-slate-600">
                  Escolha CNAE, localização, porte, faturamento e outros critérios para encontrar o cliente ideal.
                </p>
              </div>
            </div>

            {/* Step 3 - NOVO */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/50">
                  <span className="text-3xl md:text-4xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                  Escolha onde receber
                </h3>
                <p className="text-sm md:text-base text-slate-600">
                  Você decide: e-mail ou WhatsApp. Enviamos no formato que funciona para você.
                </p>
              </div>
            </div>

            {/* Step 4 - NOVO */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mb-6 shadow-2xl shadow-rose-500/50">
                  <span className="text-3xl md:text-4xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                  Receba sua lista
                </h3>
                <p className="text-sm md:text-base text-slate-600">
                  Exporte até 150 empresas filtradas em CSV. Suba no seu CRM e comece a vender hoje mesmo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO + URGÊNCIA */}
      <section id="formulario" className="py-16 md:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* COLUNA ESQUERDA - EXPLICAÇÃO */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Comece grátis agora mesmo
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Preencha o formulário ao lado e libere acesso imediato ao painel de filtros avançados. 
                  Não pedimos cartão de crédito e você pode usar <span className="font-semibold text-slate-900">100% grátis</span> na primeira pesquisa.
                </p>
              </div>

              {/* Garantias */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">150 contatos segmentados grátis</p>
                    <p className="text-sm text-slate-600">Na sua primeira busca, sem compromisso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Dados da Receita Federal</p>
                    <p className="text-sm text-slate-600">Base oficial com 32M+ empresas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Sem cartão, sem pegadinha</p>
                    <p className="text-sm text-slate-600">Teste completo sem precisar pagar nada</p>
                  </div>
                </div>
              </div>

              {/* Urgência visual */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900 mb-1">
                      Oferta limitada: {LIMITE_SEMANA} acessos grátis por semana
                    </h3>
                    {usadosSemana > 0 && (
                      <p className="text-sm text-orange-800">
                        Já foram usados <span className="font-bold">{usadosSemana} acessos</span> nesta semana. 
                        Quando atingir o limite, volta para lista de espera.
                      </p>
                    )}
                    <div className="mt-3 h-2 bg-orange-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                        style={{ width: `${(usadosSemana / LIMITE_SEMANA) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Garantia reversa */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Garantia reversa de relevância
                    </h3>
                    <p className="text-sm text-slate-300">
                      Se você não encontrar empresas relevantes na primeira busca, liberamos{' '}
                      <span className="font-semibold text-white">+150 contatos de outro segmento</span>{' '}
                      sem custo adicional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA - FORMULÁRIO */}
            <div className="lg:sticky lg:top-24">
              <div className="relative">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl rounded-3xl" />
                
                <div className="relative p-8 rounded-3xl border border-white/20 shadow-2xl shadow-blue-900/10">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium mb-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      Acesso imediato • 100% grátis • Sem cartão
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Libere seus 150 leads B2B agora
                    </h3>
                    <p className="text-slate-600">
                      Preencha os dados abaixo e comece a gerar listas segmentadas
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        placeholder="João Silva"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        E-mail Profissional *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="joao@empresa.com.br"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={form.telefone}
                        onChange={(e) => handleChange('telefone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        inputMode="tel"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>

                    {/* Segmento */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Para qual segmento você vende? *
                      </label>
                      <select
                        value={form.segmento}
                        onChange={(e) => handleChange('segmento', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          backgroundSize: '1.5rem'
                        }}
                      >
                        <option value="">Selecione seu segmento…</option>
                        {SEGMENTOS.map((seg) => (
                          <option key={seg} value={seg}>
                            {seg}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Erro */}
                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                        <p className="text-sm text-red-800 font-medium">{error}</p>
                      </div>
                    )}

                    {/* Botão Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg shadow-xl shadow-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/60 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processando...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Desbloquear meus 150 contatos agora
                          </>
                        )}
                      </span>
                    </button>

                    {/* Social Proof no Form */}
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-bold text-white">+9K</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          Mais de 9.700 profissionais já geraram listas com a gente
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          100% Gratuito
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Dados oficiais RF
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Sem cartão
                        </span>
                      </div>
                    </div>

                    {/* Aviso Legal */}
                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                      Ao continuar, você concorda com nossa{' '}
                      <a href="/politica-de-privacidade" className="underline hover:text-slate-700">
                        Política de Privacidade
                      </a>{' '}
                      e{' '}
                      <a href="/termos-de-uso" className="underline hover:text-slate-700">
                        Termos de Uso
                      </a>
                      . Seus dados não serão vendidos ou compartilhados com terceiros.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - Texto Atualizado */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Coluna 1 - Logo e descrição */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052CC] to-blue-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">TáBombandoAgora</h3>
                  <p className="text-xs text-slate-400">Prospecção B2B Inteligente</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Ferramenta de prospecção B2B integrada à base da Receita Federal. 
                Encontre e exporte listas segmentadas em minutos.
              </p>
            </div>

            {/* Coluna 2 - Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="/precos" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/suporte" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>

            {/* Coluna 3 - Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="/lgpd" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-800 text-sm text-center text-slate-400">
            <p>© 2024 TáBombandoAgora. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
