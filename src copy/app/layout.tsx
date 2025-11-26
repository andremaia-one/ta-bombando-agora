import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleTags } from "@/lib/google-tags";
import { MetaPixel } from "@/lib/meta-pixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaBombandoAgora - Prospecção B2B Inteligente",
  description:
    "Encontre seus clientes ideais em nossa base com 32 milhões de empresas brasileiras. Teste grátis com 150 leads qualificados.",
  openGraph: {
    title: "TaBombandoAgora - Prospecção B2B Inteligente",
    description:
      "Acesse leads segmentados e gratuitos para impulsionar sua prospecção B2B.",
    url: "https://tabombandoagora.info",
    siteName: "TaBombandoAgora",
    images: [
      {
        url: "https://tabombandoagora.info/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TaBombandoAgora - Prospecção B2B",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
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
