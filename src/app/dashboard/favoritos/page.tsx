import Link from "next/link";

export const metadata = { title: "Favoritos | Dashboard" };

export default function FavoritosPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Favoritos</h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Voltar ao Dashboard
        </Link>
      </div>
      <div className="rounded-lg border bg-white p-6 text-gray-600">
        <p>Nenhum lead favoritado ainda.</p>
        <p className="mt-2 text-sm">
          Marque os leads como favoritos na listagem para que apareçam aqui.
        </p>
      </div>
    </main>
  );
}
