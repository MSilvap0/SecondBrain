'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ProtectedRoute } from './ProtectedRoute';
// Fallback stub for CommandPalette to avoid module not found errors.
// If a real CommandPalette component exists, replace this stub or add the module.
function CommandPalette() {
  return null;
}
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Command Palette Global */}
        <CommandPalette />
        
        {/* Navbar */}
        <Navbar
          userName={user?.name}
          userEmail={user?.email}
          onLogout={logout}
        />

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
