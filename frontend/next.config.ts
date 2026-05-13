import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de produção
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Otimizações de build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Garantir que variáveis de ambiente sejam carregadas corretamente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
