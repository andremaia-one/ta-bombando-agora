import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleTags } from "@/lib/google-tags";
import { MetaPixel } from "@/lib/meta-pixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaBombandoAgora - Prospeccao B2B Inteligente",
  description: "Encontre seus clientes ideais em nossa base com 32 milhoes de empresas brasileiras. Teste gratis com 150 leads qualificados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <GoogleTags 
          gaId="G-81TE3P4LJP"
          gtagIds={["GT-PLWZ53WC", "GT-WBKXFVTH"]}
          adsId="AW-17649433512"
        />
        
        <MetaPixel pixelId="1537082727315105" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}