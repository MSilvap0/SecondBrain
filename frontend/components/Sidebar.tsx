'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Lightbulb,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export function Sidebar({ userName, userEmail, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      label: 'Ideias',
      icon: Lightbulb,
      href: '/ideas'
    },
    {
      label: 'Favoritos',
      icon: Star,
      href: '/favorites'
    },
    {
      label: 'Configurações',
      icon: Settings,
      href: '/settings'
    },
    {
      label: 'Animações Demo',
      icon: Sparkles,
      href: '/animations-demo'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Header Minimalista Elegante */}
      <div className="py-6 px-6 border-b border-black/[0.06]">
        {!isCollapsed ? (
          <div className="w-full flex items-center justify-center">
            <div className="relative group">
              {/* Logo container minimalista */}
              <div className="relative p-4 rounded-xl bg-surface-50 border border-slate-700 hover:border-slate-600 transition-all duration-300">
                <img
                  src={`/logo.png?v=${Date.now()}`}
                  alt="Second Brain"
                  className="h-24 w-auto object-contain relative z-10"
                  style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="bg-surface-2 p-2.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-on-surface" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Minimalista Elegante */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                relative group/item font-medium text-sm
                transition-all duration-200
                ${isActive
                  ? 'bg-surface-2 text-on-surface shadow-sm'
                  : 'text-neutral-300 hover:text-on-surface hover:bg-surface-50'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              whileHover={{ x: isCollapsed ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              <motion.div
                whileHover={{ rotate: isActive ? 0 : 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
              </motion.div>
              
              {!isCollapsed && (
                <>
                  <motion.span
                    className="flex-1 text-left font-medium text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                  {item.badge && (
                    <motion.span
                      className="px-2 py-0.5 bg-surface-2 text-on-surface text-xs font-semibold rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <AnimatePresence>
                  <motion.div
                    className="absolute left-full ml-2 px-3 py-2 bg-surface-2 text-on-surface text-sm rounded-lg opacity-0 group-hover/item:opacity-100 pointer-events-none whitespace-nowrap z-50"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-black/[0.06]">
        {!isCollapsed ? (
          <div className="space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-30 border border-slate-700">
              <div className="w-9 h-9 bg-surface-2 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-on-surface" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">
                  {userName || 'Usuário'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {userEmail || 'email@example.com'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sair</span>
            <button
            className="w-full flex items-center justify-center p-3 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative group"
        ) : (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center p-3 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative group"
          >
            <LogOut className="w-5 h-5" />
            <div className="absolute left-full ml-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Sair
            </div>
          </button>
        )}
      </div>

      {/* Collapse Toggle - Desktop only */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-surface border border-slate-700 rounded-full items-center justify-center text-neutral-300 hover:text-on-surface shadow-sm z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 shadow-sm hover:shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside
        className={`
          hidden lg:flex flex-col
          fixed left-0 top-0 h-screen
          bg-white
          border-r border-black/[0.06]
          transition-all duration-500 ease-out
          z-30
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`
          lg:hidden flex flex-col
          fixed left-0 top-0 h-screen w-72
          bg-white
          border-r border-black/[0.06]
          shadow-xl
          transition-transform duration-500 ease-out
          z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
