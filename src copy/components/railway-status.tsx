"use client";

import { useEffect, useState } from "react";
import { useRailway } from "@/components/railway-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, WifiOff } from "lucide-react";

export function RailwayStatus() {
  const { isProduction, apiUrl } = useRailway();
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  
  useEffect(() => {
    // Apenas verificar se estiver em produção
    if (!isProduction) {
      setStatus("online"); // Consideramos sempre online em desenvolvimento
      return;
    }
    
    const checkStatus = async () => {
      try {
        // Tenta fazer uma chamada simples para o endpoint de status
        const response = await fetch(`${apiUrl}/status`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Adicionando isto para evitar cache
          cache: 'no-store'
        });
        
        if (response.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
        setStatus("offline");
      }
    };
    
    // Verifica imediatamente
    checkStatus();
    
    // Configura um intervalo de verificação (a cada 5 minutos)
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isProduction, apiUrl]);
  
  if (!isProduction || status === "online") {
    return null; // Não mostra nada se for desenvolvimento ou se estiver online
  }
  
  return (
    <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto max-w-md z-50">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Problemas de conexão</AlertTitle>
      <AlertDescription>
        Estamos com dificuldades para conectar ao servidor. Algumas funcionalidades podem estar temporariamente indisponíveis.
      </AlertDescription>
    </Alert>
  );
}

export function RailwayConnected() {
  const { isProduction } = useRailway();
  
  if (!isProduction) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 left-4 bg-green-50 text-green-700 px-3 py-2 rounded-md text-xs flex items-center z-50">
      <CheckCircle className="h-3 w-3 mr-2" />
      Railway Connected
    </div>
  );
}