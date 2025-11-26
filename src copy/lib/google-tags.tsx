import Script from 'next/script'

interface GoogleTagsProps {
  gaId: string
  gtagIds: string[]
  adsId: string
}

export function GoogleTags({ gaId, gtagIds, adsId }: GoogleTagsProps) {
  return (
    <>
      {/* Google Tag (gtag.js) - Carrega ANTES de configurar */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      
      {/* Configuração do Google Analytics + Ads */}
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Google Analytics 4
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
          
          // Outros Google Tags
          ${gtagIds.map(id => `gtag('config', '${id}');`).join('\n          ')}
          
          // Google Ads
          gtag('config', '${adsId}');
          
          console.log('[Google Tags] Configurados:', {
            ga4: '${gaId}',
            tags: ${JSON.stringify(gtagIds)},
            ads: '${adsId}'
          });
        `}
      </Script>
    </>
  )
}