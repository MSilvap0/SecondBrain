'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  category: 'navigation' | 'action' | 'idea' | 'settings';
  shortcut?: string;
  action: () => void;
}

interface UseCommandPaletteOptions {
  items?: CommandItem[];
}

export function useCommandPalette({ items = [] }: UseCommandPaletteOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Detectar Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filtrar items baseado na busca
  const filteredItems = search
    ? items.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  // Selecionar item atual
  const selectNext = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
  }, [filteredItems.length]);

  const selectPrev = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + Math.max(1, filteredItems.length)) % Math.max(1, filteredItems.length));
  }, [filteredItems.length]);

  // Executar ação do item selecionado
  const executeSelected = useCallback(() => {
    const item = filteredItems[selectedIndex];
    if (item) {
      item.action();
      setIsOpen(false);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [filteredItems, selectedIndex]);

  // Resetar quando fechar
  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setSelectedIndex(0);
  }, []);

  return {
    isOpen,
    search,
    setSearch,
    selectedIndex,
    filteredItems,
    selectNext,
    selectPrev,
    executeSelected,
    close,
    open,
    setIsOpen,
  };
}
