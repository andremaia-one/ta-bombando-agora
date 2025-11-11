import Link from "next/link";

export const metadata = { title: "Exportados | Dashboard" };

export default function ExportadosPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exportados</h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Voltar ao Dashboard
        </Link>
      </div>
      <div className="rounded-lg border bg-white p-6 text-gray-600">
        <p>Você ainda não exportou nenhum lead.</p>
        <p className="mt-2 text-sm">
          Quando você fizer exportações, elas aparecerão listadas aqui.
        </p>
      </div>
    </main>
  );
}
