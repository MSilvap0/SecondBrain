'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useMemo } from 'react';
import {
  Search,
  LayoutDashboard,
  Lightbulb,
  Settings,
  FileText,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';
import { useCommandPalette, CommandItem } from '@/hooks/useCommandPalette';

interface CommandPaletteProps {
  // Props opcionais para customização
  placeholder?: string;
  showOnMount?: boolean;
}

// Categoria labels
const categoryLabels: Record<CommandItem['category'], string> = {
  navigation: 'Navegação',
  action: 'Ações',
  idea: 'Ideias',
  settings: 'Configurações',
};

const categoryIcons: Record<CommandItem['category'], React.ComponentType<{ className?: string }>> = {
  navigation: LayoutDashboard,
  action: Sparkles,
  idea: Lightbulb,
  settings: Settings,
};

export function CommandPalette({ placeholder = 'Buscar ideias, ações...', showOnMount = false }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Itens disponíveis no Command Palette
  const items: CommandItem[] = useMemo(() => [
    // Navegação
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'Ver seu painel de controle',
      category: 'navigation',
      shortcut: '⌘+D',
      action: () => router.push('/dashboard'),
    },
    {
      id: 'nav-ideas',
      label: 'Minhas Ideias',
      description: 'Gerenciar todas as ideias',
      category: 'navigation',
      shortcut: '⌘+I',
      action: () => router.push('/ideas'),
    },
    {
      id: 'nav-favorites',
      label: 'Favoritos',
      description: 'Ideias favoritadas',
      category: 'navigation',
      action: () => router.push('/favorites'),
    },
    {
      id: 'nav-pricing',
      label: 'Planos e Preços',
      description: 'Ver planos disponíveis',
      category: 'navigation',
      action: () => router.push('/pricing'),
    },
    // Ações
    {
      id: 'action-new-idea',
      label: 'Nova Ideia',
      description: 'Criar uma nova ideia',
      category: 'action',
      shortcut: '⌘+N',
      action: () => router.push('/ideas'),
    },
    {
      id: 'action-chat',
      label: 'Conversar com IA',
      description: 'Abrir chat com inteligência artificial',
      category: 'action',
      shortcut: '⌘+C',
      action: () => router.push('/chat'),
    },
    {
      id: 'action-onboarding',
      label: 'Tour Inicial',
      description: 'Fazer tour pelo sistema',
      category: 'action',
      action: () => router.push('/onboarding'),
    },
    // Configurações
    {
      id: 'settings-main',
      label: 'Configurações',
      description: 'Ajustar preferências',
      category: 'settings',
      shortcut: '⌘+,',
      action: () => router.push('/settings'),
    },
    {
      id: 'settings-upgrade',
      label: 'Atualizar Plano',
      description: 'Upgrade para Premium',
      category: 'settings',
      action: () => router.push('/pricing'),
    },
  ], [router]);

  const {
    isOpen,
    search,
    setSearch,
    selectedIndex,
    filteredItems,
    selectNext,
    selectPrev,
    executeSelected,
    close,
  } = useCommandPalette({ items });

  // Focar input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scrollar item selecionado into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      (selected as HTMLElement | null)?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  // Agrupar por categoria
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    
    filteredItems.forEach((item, index) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push({ ...item, id: `${item.id}-${index}` });
    });
    
    return groups;
  }, [filteredItems]);

  // Não renderizar se fechado
  if (!isOpen) return null;

  let currentIndex = 0;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={close}
    >
      {/* Backdrop com blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
{/* Modal */}
      <div 
        className="relative w-full max-w-xl bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Input Area */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectNext();
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectPrev();
              } else if (e.key === 'Enter') {
                e.preventDefault();
                executeSelected();
              }
            }}
            placeholder={placeholder}
            className="flex-1 text-base text-white placeholder:text-slate-500 outline-none bg-transparent"
          />
          <button
            onClick={close}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="max-h-[400px] overflow-y-auto py-2"
        >
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Nenhum resultado encontrado</p>
              <p className="text-sm text-slate-400 mt-1">
                Tente buscar por outro termo
              </p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="mb-2">
                <div className="px-4 py-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {categoryLabels[category as CommandItem['category']]}
                  </span>
                </div>
                {categoryItems.map((item) => {
                  const idx = currentIndex++;
                  const Icon = item.icon || categoryIcons[item.category];
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={() => {
                        item.action();
                        close();
                      }}
                      onMouseEnter={() => setSearch('')}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-slate-700' : 'bg-slate-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.label}</p>
                        {item.description && (
                          <p className="text-sm text-slate-500 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-800 rounded">
                          {item.shortcut}
                        </kbd>
                      )}
                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

{/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-medium">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-medium">↵</kbd>
              selecionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-medium">esc</kbd>
              fechar
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Sparkles className="w-3 h-3" />
            <span>Powered by IA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
