'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { analytics } from '@/lib/analytics'

export default function ObrigadoPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'whatsapp' | ''>('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showEditContact, setShowEditContact] = useState(false)
  
  // Dados salvos anteriormente
  const [savedEmail, setSavedEmail] = useState('')
  const [savedPhone, setSavedPhone] = useState('')
  const [leadsCount, setLeadsCount] = useState(150)

  useEffect(() => {
    // Recuperar dados salvos
    const email = sessionStorage.getItem('userEmail')
    const phone = sessionStorage.getItem('userPhone')
    const count = sessionStorage.getItem('leadsCount')
    
    if (email) setSavedEmail(email)
    if (phone) setSavedPhone(phone)
    if (count) setLeadsCount(parseInt(count))

    // Carregar script do Ilworlds/Offerwall
    loadRewardedAdScript()
  }, [])

  const loadRewardedAdScript = () => {
    // TODO: Integrar com Ilworlds, Offerwall ou similar
    // Exemplo de integração:
    /*
    const script = document.createElement('script')
    script.src = 'https://ilworlds.com/sdk.js'
    script.async = true
    script.onload = () => {
      // Inicializar offerwall
      window.ILWorlds.init({ appId: 'SEU_APP_ID' })
    }
    document.body.appendChild(script)
    */
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData = {
        name: sessionStorage.getItem('userName'),
        email: selectedMethod === 'email' ? contact : savedEmail,
        phone: selectedMethod === 'whatsapp' ? contact : savedPhone,
        segmento: sessionStorage.getItem('userSegmento'),
        delivery_method: selectedMethod,
        delivery_contact: contact,
        leads_count: leadsCount
      }

      console.log('[Lead Delivery Request]', userData)

      // Disparar evento de conversão
      await analytics.exportClicked()

      // TODO: Enviar para backend/n8n
      // await fetch('/api/send-leads', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })

      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Atualizar dados no sessionStorage se editou
      if (selectedMethod === 'email') {
        sessionStorage.setItem('userEmail', contact)
      } else {
        sessionStorage.setItem('userPhone', contact)
      }

      setSuccess(true)

      // Mostrar rewarded ad antes de redirecionar
      // showRewardedAd()

      // Redirecionar após 5 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 5000)

    } catch (error) {
      console.error('Erro ao processar:', error)
      alert('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-selecionar método se já tiver dados salvos
  useEffect(() => {
    if (!selectedMethod) {
      if (savedEmail && !savedPhone) {
        setSelectedMethod('email')
        setContact(savedEmail)
      } else if (savedPhone && !savedEmail) {
        setSelectedMethod('whatsapp')
        setContact(savedPhone)
      }
    }
  }, [savedEmail, savedPhone, selectedMethod])

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12">
          
          {/* Success Animation */}
          <div className="text-center mb-6">
            <div className="inline-block bg-green-100 rounded-full p-6 animate-bounce">
              <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            🎉 Tudo Certo!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2 text-center">
            Seus <strong>{leadsCount}</strong> leads estão sendo enviados para:
          </p>
          
          <p className="text-2xl font-bold text-blue-600 mb-8 text-center">
            {contact}
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-8">
            <p className="text-sm text-blue-800">
              <strong>Próximos passos:</strong> Verifique sua caixa de entrada (ou WhatsApp) nos próximos minutos. Se não receber, verifique o spam!
            </p>
          </div>

          {/* Área para Rewarded Ad */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
            <p className="text-center text-sm text-gray-700 mb-3">
              💎 <strong>Ganhe acesso premium:</strong> Assista um vídeo rápido e desbloqueie filtros avançados
            </p>
            <div className="flex justify-center">
              {/* Aqui vai o iframe/widget do Ilworlds ou Offerwall */}
              <div id="rewarded-ad-container" className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">[Anúncio Rewarded Aqui]</p>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-sm text-center animate-pulse">
            Redirecionando para o dashboard em alguns segundos...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TaBombandoAgora
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
              🎉 PARABÉNS!
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Como você quer receber seus {leadsCount} leads?
            </h2>
            <p className="text-lg text-gray-600">
              Escolha o método de entrega mais conveniente para você
            </p>
          </div>

          {/* Dados Salvos - Info */}
          {(savedEmail || savedPhone) && !showEditContact && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
              <p className="text-sm text-blue-800 mb-2">
                ℹ️ <strong>Dados já cadastrados:</strong>
              </p>
              {savedEmail && (
                <p className="text-sm text-blue-700">
                  📧 Email: <strong>{savedEmail}</strong>
                </p>
              )}
              {savedPhone && (
                <p className="text-sm text-blue-700">
                  📱 WhatsApp: <strong>{savedPhone}</strong>
                </p>
              )}
              <button
                onClick={() => setShowEditContact(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold mt-2 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Corrigir dados
              </button>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Seleção do Método */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Email */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('email')
                  if (savedEmail && !showEditContact) {
                    setContact(savedEmail)
                  } else {
                    setContact('')
                  }
                }}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200
                  ${selectedMethod === 'email' 
                    ? 'border-blue-600 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    📧 Receber por Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    Arquivo CSV completo na sua caixa de entrada
                  </p>
                </div>
                {selectedMethod === 'email' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-600 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                )}
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod('whatsapp')
                  if (savedPhone && !showEditContact) {
                    setContact(savedPhone)
                  } else {
                    setContact('')
                  }
                }}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200
                  ${selectedMethod === 'whatsapp' 
                    ? 'border-green-600 bg-green-50 shadow-lg' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    💬 Receber no WhatsApp
                  </h3>
                  <p className="text-sm text-gray-600">
                    Link direto para download via mensagem
                  </p>
                </div>
                {selectedMethod === 'whatsapp' && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-600 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                )}
              </button>

            </div>

            {/* Campo de Contato */}
            {selectedMethod && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  {selectedMethod === 'email' ? 'Confirme seu email:' : 'Informe seu WhatsApp:'}
                </label>
                <input
                  type={selectedMethod === 'email' ? 'email' : 'tel'}
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={selectedMethod === 'email' ? 'seu@email.com' : '(XX) XXXXX-XXXX'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                {!showEditContact && ((selectedMethod === 'email' && savedEmail) || (selectedMethod === 'whatsapp' && savedPhone)) && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Usando dados já cadastrados. Altere se necessário.
                  </p>
                )}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={!selectedMethod || !contact || loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  ENVIANDO...
                </span>
              ) : (
                `CONFIRMAR E RECEBER MEUS ${leadsCount} LEADS`
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              ✅ Seus dados estão seguros e não serão compartilhados
            </p>

          </form>

        </div>

        {/* Área para Rewarded Ad - Antes de enviar */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
            💎 Ganhe Filtros Premium Grátis
          </h3>
          <p className="text-sm text-gray-700 mb-4 text-center">
            Assista um vídeo rápido e desbloqueie filtros avançados de prospecção
          </p>
          <div className="flex justify-center">
            {/* Aqui vai o iframe/widget do Ilworlds ou Offerwall */}
            <div id="rewarded-ad-preview" className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-center px-4">
                [Integração com Ilworlds/Offerwall/Rewarded Ads]
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 TaBombandoAgora. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  )
}