import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de produção
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Variáveis de ambiente para produção
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com',
  },
  // Otimizações de build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
