'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Rotas públicas
      const publicRoutes = ['/', '/landing', '/login', '/register', '/verify-email'];
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

      if (isPublicRoute) {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // Verifica se tem token
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Não autenticado - redireciona para login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        setIsAuthenticated(false);
      } else {
        // Autenticado
        setIsAuthenticated(true);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Mostra loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="min-h-screen ui-shell flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderiza nada (já está redirecionando)
  if (!isAuthenticated) {
    return null;
  }

  // Renderiza o conteúdo protegido
  return <>{children}</>;
}
