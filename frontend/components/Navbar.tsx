'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Star, 
  Settings, 
  LogOut,
  ChevronDown,
  Plus,
  Sparkles,
  Crown,
  Book
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function Navbar({ userName, userEmail, onLogout }: NavbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Ideias', icon: Lightbulb, href: '/ideas' },
    { label: 'Favoritos', icon: Star, href: '/favorites' },
    { label: 'Docs', icon: Book, href: '/docs' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Premium Dark */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <span className="text-lg font-bold text-white tracking-tight">
                SecondBrain
              </span>
            </button>

            {/* Navigation Links Premium Dark */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white bg-zinc-800'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side Premium Dark */}
          <div className="flex items-center gap-2">
            
            {/* Upgrade Button Premium */}
            <button
              onClick={() => router.push('/pricing')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade</span>
            </button>

            {/* New Idea Button Premium Dark */}
            <button
              onClick={() => router.push('/ideas')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Ideia</span>
            </button>

            {/* Settings Premium Dark */}
            <button
              onClick={() => router.push('/settings')}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Menu Premium Dark */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-800 transition-all"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-medium text-white">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Premium Dark */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl py-1.5 shadow-xl animate-scale-in">
                  <div className="px-3 py-2.5 border-b border-zinc-800">
                    <p className="text-sm font-medium text-white">
                      {userName || 'Usuário'}
                    </p>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {userEmail || 'email@example.com'}
                    </p>
                  </div>
                  
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        router.push('/pricing');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 rounded-md transition-all"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade de Plano
                    </button>

                    <button
                      onClick={() => {
                        router.push('/settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 rounded-md transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      Configurações
                    </button>

                    <button
                      onClick={() => {
                        onLogout?.();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
