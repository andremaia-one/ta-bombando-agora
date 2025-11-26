/** @type {import('next').NextConfig} */
const nextConfig = {
  // Saída standalone para Vercel / Railway
  output: "standalone",

  // React Strict Mode
  reactStrictMode: false,

  // Força novo artefato a cada build
  generateBuildId: async () => "build-" + Date.now(),

  // Configurações de imagem
  images: {
    domains: ["railway.app", "www.railway.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: process.env.NODE_ENV !== "production",
  },

  // Experimental ainda válido no Next 15
  experimental: {
    typedRoutes: false,
  },

  // Novo nome no Next 15 (antes: experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["@supabase/supabase-js"],

  // Webpack: fallbacks para módulos Node no client + split de chunks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: "all",
      },
    };

    return config;
  },

  // Headers de segurança / CORS para /api/*
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  // ESLint / TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Removido: swcMinify (não é mais suportado no Next 15)

  // Variáveis de ambiente expostas no bundle
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },

  // Ajustes extras em desenvolvimento
  ...(process.env.NODE_ENV === "development" && {
    // Se quiser, pode reativar reactStrictMode aqui,
    // mas mantive igual ao seu padrão atual
    // reactStrictMode: false,
  }),
};

module.exports = nextConfig;
