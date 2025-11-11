"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard-header";
import { MadeWithLasy } from "@/components/made-with-lasy";
import LeadFilterForm from "@/components/lead-filter-form";
import LeadResults from "@/components/lead-results";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  useEffect(() => {
    // Checa "login" simples via sessionStorage
    const storedName = typeof window !== "undefined" ? sessionStorage.getItem("userName") : null;
    const storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("userEmail") : null;

    if (!storedEmail || !storedName) {
      router.push("/");
      return;
    }

    setUserName(storedName);
    setIsLoading(false);
  }, [router]);

  const handleFilterApply = (filters: any) => {
    setAppliedFilters(filters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const firstName = userName?.split(" ")[0] ?? "usuário";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" suppressHydrationWarning>
      <DashboardHeader userName={userName} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao seu Trial, {firstName}!</h1>
          <p className="text-gray-600">
            Utilize os filtros abaixo para encontrar leads B2B que se encaixam no perfil ideal para o seu negócio.
          </p>
        </div>

        {/* Card do Trial */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Status do seu Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="mb-1">Você tem acesso a:</p>
                <div className="text-2xl font-bold text-blue-800">150 leads</div>
                <p className="text-sm text-gray-600 mt-1">Válido por 7 dias</p>
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600">Fazer Upgrade</Button>
            </div>
          </CardContent>
        </Card>

        {/* Filtros + Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-1">
            <LeadFilterForm onApplyFilters={handleFilterApply} />
          </section>

          <section className="lg:col-span-3">
            <LeadResults filters={appliedFilters} />
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} B2B Leads. Todos os direitos reservados.</p>
        </div>
      </footer>

      <MadeWithLasy />
    </div>
  );
}
