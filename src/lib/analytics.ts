declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export interface LeadData {
  nome: string;
  email: string;
  telefone: string;
  segmento: string;
  cargo?: string;
}

// Helper para garantir que gtag está pronto
const waitForGtag = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.gtag) {
      resolve(true)
      return
    }
    
    // Espera até 3 segundos pelo gtag
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      if (window.gtag) {
        clearInterval(interval)
        resolve(true)
      } else if (attempts > 30) { // 30 * 100ms = 3s
        clearInterval(interval)
        resolve(false)
      }
    }, 100)
  })
}

export const analytics = {
  // Meta Pixel
  trackMetaEvent(eventName: string, data?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', eventName, data)
        console.log('[Meta Pixel] ✅', eventName, data)
      } catch (error) {
        console.error('[Meta Pixel] ❌', error)
      }
    } else {
      console.warn('[Meta Pixel] ⚠️ fbq não disponível')
    }
  },

  // Google Analytics (com espera)
  async trackGoogleEvent(eventName: string, data?: Record<string, any>) {
    if (typeof window === 'undefined') return

    const isReady = await waitForGtag()
    
    if (!isReady || !window.gtag) {
      console.warn('[Google Analytics] ⚠️ gtag não disponível após espera')
      return
    }

    try {
      window.gtag('event', eventName, data)
      console.log('[Google Analytics] ✅', eventName, data)
    } catch (error) {
      console.error('[Google Analytics] ❌', error)
    }
  },

  // Lead capturado
  async leadCaptured(leadData: LeadData) {
    // Meta Pixel
    this.trackMetaEvent('Lead', {
      content_name: 'Trial Signup',
      content_category: leadData.segmento,
      value: 0,
      currency: 'BRL'
    })

    // Google Analytics (await para garantir que gtag está pronto)
    await this.trackGoogleEvent('generate_lead', {
      event_category: 'engagement',
      event_label: leadData.segmento,
      segment: leadData.segmento,
      job_title: leadData.cargo || 'não informado'
    })

    // Google Ads Conversion
    await this.trackGoogleEvent('conversion', {
      send_to: 'AW-17649433512/conversion_label', // ⚠️ IMPORTANTE: adicionar label correto
      value: 0,
      currency: 'BRL'
    })
  },

  // Trial iniciado
  async trialStarted(email: string, segmento: string) {
    this.trackMetaEvent('StartTrial', { email, segment: segmento })
    await this.trackGoogleEvent('trial_started', { segment: segmento })
  },

  // Busca realizada
  async searchPerformed(filters: { cnae?: string; keyword?: string; uf?: string }) {
    const searchTerm = filters.cnae || filters.keyword || 'busca_geral'
    
    this.trackMetaEvent('Search', { 
      search_string: searchTerm,
      uf: filters.uf 
    })
    
    await this.trackGoogleEvent('search', { 
      search_term: searchTerm,
      uf: filters.uf 
    })
  },

  // Exportar
  async exportClicked() {
    this.trackMetaEvent('InitiateCheckout', {
      content_name: 'Export Leads'
    })
    
    await this.trackGoogleEvent('begin_checkout', {
      items: [{ item_name: 'export_csv' }]
    })
  }
}