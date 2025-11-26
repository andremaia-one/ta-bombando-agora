"use client"

import { useEffect, useState } from "react"

export default function ContadorAcessos() {
  const [acessos, setAcessos] = useState(0)

  useEffect(() => {
    const base = 185
    const incremento = Math.floor((Date.now() / 60000) % 90)
    setAcessos(base + incremento)
  }, [])

  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
      <div className="mt-1 w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-red-600 text-sm font-bold">!</span>
      </div>
      <div className="text-sm text-red-700">
        <p>
          Essa oferta gratuita é limitada a{" "}
          <strong>300 acessos por semana</strong>. Quando o limite é atingido, o acesso
          volta para a lista de espera.
        </p>
        <p className="mt-1 text-xs">
          <span className="font-semibold">{acessos} de 300</span> acessos já utilizados
          nesta semana.
        </p>
      </div>
    </div>
  )
}
