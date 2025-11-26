// src/components/HomeClient.tsx
"use client";

import Link from "next/link";
import { MadeWithLasy } from "@/components/made-with-lasy";
import LeadForm from "@/components/lead-form";

export default function HomeClient() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">TaBombandoAgora</div>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section com formulário */}
      <main className="flex-grow bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Acelere Suas Vendas: Teste Grátis 150 Leads B2B Qualificados
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Encontre seus clientes ideais em nossa base de dados de 32 milhões de empresas e comece a vender hoje.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
                <p className="font-semibold text-blue-800">
                  <span className="font-bold">Trial Exclusivo:</span> 150 Leads B2B de Alta Qualidade. Sem Compromisso.
                </p>
              </div>
            </div>

            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 TaBombandoAgora. Todos os direitos reservados.</p>
        </div>
      </footer>

      <MadeWithLasy />
    </div>
  );
}
