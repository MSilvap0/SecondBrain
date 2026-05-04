import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/', '/landing', '/login', '/register', '/verify-email'];

// Rotas que só usuários NÃO autenticados podem acessar
const authRoutes = ['/login', '/register'];

// Função proxy - nova convenção do Next.js 16
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Pega o token do cookie
  const token = request.cookies.get('token')?.value;
  
  // Verifica se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Verifica se é uma rota de autenticação (login/register)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Se o usuário está autenticado e tenta acessar login/register, redireciona para dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Se o usuário NÃO está autenticado e tenta acessar rota protegida
  if (!token && !isPublicRoute) {
    // Salva a URL que o usuário tentou acessar para redirecionar depois do login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

// Exportação default também para compatibilidade
export default proxy;

// Configuração do matcher - define quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)',
  ],
};
