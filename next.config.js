/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",

  // força novo artefato a cada build
  generateBuildId: async () => "build-" + Date.now(),

  images: {
    domains: ["railway.app", "www.railway.app"],
    unoptimized: process.env.NODE_ENV !== "production",
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
