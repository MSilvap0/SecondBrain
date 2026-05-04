'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[] = []) {
  const router = useRouter();

  // Default shortcuts (always available)
  const defaultShortcuts: KeyboardShortcut[] = [
    {
      key: 'd',
      metaKey: true,
      action: () => router.push('/dashboard'),
      description: 'Ir para Dashboard',
    },
    {
      key: 'i',
      metaKey: true,
      action: () => router.push('/ideas'),
      description: 'Ir para Ideias',
    },
    {
      key: 'f',
      metaKey: true,
      action: () => router.push('/favorites'),
      description: 'Ir para Favoritos',
    },
    {
      key: 'c',
      metaKey: true,
      action: () => router.push('/chat'),
      description: 'Abrir Chat com IA',
    },
    {
      key: 'o',
      metaKey: true,
      action: () => router.push('/onboarding'),
      description: 'Tour Inicial',
    },
    {
      key: ',',
      metaKey: true,
      action: () => router.push('/settings'),
      description: 'Configurações',
    },
    {
      key: 'p',
      metaKey: true,
      action: () => router.push('/pricing'),
      description: 'Planos e Preços',
    },
  ];

  const allShortcuts = [...defaultShortcuts, ...shortcuts];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Check for matching shortcuts
    for (const shortcut of allShortcuts) {
      const metaOrCtrl = e.metaKey || e.ctrlKey;
      const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
      const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey;
      const altMatch = shortcut.altKey ? e.altKey : !e.altKey;
      const metaMatch = shortcut.metaKey ? metaOrCtrl : !metaOrCtrl;

      if (
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        metaMatch &&
        shiftMatch &&
        ctrlMatch &&
        altMatch
      ) {
        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [allShortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts: allShortcuts };
}

// Export default shortcuts for reference
export const defaultShortcutsList = [
  { key: '⌘ D', description: 'Dashboard', category: 'Navegação' },
  { key: '⌘ I', description: 'Minhas Ideias', category: 'Navegação' },
  { key: '⌘ F', description: 'Favoritos', category: 'Navegação' },
  { key: '⌘ C', description: 'Chat com IA', category: 'Ações' },
  { key: '⌘ N', description: 'Nova Ideia', category: 'Ações' },
  { key: '⌘ O', description: 'Tour Inicial', category: 'Ações' },
  { key: '⌘ ,', description: 'Configurações', category: 'Sistema' },
  { key: '⌘ P', description: 'Planos', category: 'Sistema' },
  { key: '⌘ K', description: 'Command Palette', category: 'Sistema' },
];
