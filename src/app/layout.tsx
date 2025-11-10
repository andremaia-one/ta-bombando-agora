// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
// importe suas fontes se houver, etc.

export const metadata: Metadata = {
  title: "TaBombandoAgora",
  description: "Leads B2B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
