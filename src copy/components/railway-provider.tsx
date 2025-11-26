"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";

// Definir o tipo de contexto para o Railway
interface RailwayContextType {
  isProduction: boolean;
  baseUrl: string;
  apiUrl: string;
  isLoaded: boolean;
}

// Criar o contexto com valores padrão
const RailwayContext = createContext<RailwayContextType>({
  isProduction: false,
  baseUrl: "",
  apiUrl: "/api",
  isLoaded: false,
});

// Hook personalizado para usar o contexto do Railway
export function useRailway() {
  return useContext(RailwayContext);
}

interface RailwayProviderProps {
  children: ReactNode;
}

export function RailwayProvider({ children }: RailwayProviderProps) {
  const [config, setConfig] = useState<RailwayContextType>({
    isProduction: false,
    baseUrl: "",
    apiUrl: "/api",
    isLoaded: false,
  });

  useEffect(() => {
    // Detectar o ambiente
    const isProduction = process.env.NODE_ENV === "production";
    
    // Determinar as URLs baseadas no ambiente
    let baseUrl = "";
    let apiUrl = "/api";

    // No ambiente de produção, o Railway fornece estas variáveis
    if (isProduction) {
      const railwayPublicUrl = process.env.NEXT_PUBLIC_RAILWAY_PUBLIC_URL || 
                              process.env.RAILWAY_PUBLIC_URL;
      
      if (railwayPublicUrl) {
        baseUrl = `https://${railwayPublicUrl}`;
        apiUrl = `https://${railwayPublicUrl}/api`;
      }
    }

    setConfig({
      isProduction,
      baseUrl,
      apiUrl,
      isLoaded: true,
    });
  }, []);

  return (
    <RailwayContext.Provider value={config}>
      {children}
    </RailwayContext.Provider>
  );
}