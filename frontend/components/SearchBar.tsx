'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Hash } from 'lucide-react';
import type { Idea } from '@/types/idea';

interface SearchBarProps {
  ideas: Idea[];
  onSearch: (results: Idea[]) => void;
  onClear: () => void;
}

export function SearchBar({ ideas, onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar buscas recentes
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Busca em tempo real
  useEffect(() => {
    if (query.trim()) {
      const results = ideas.filter(idea => {
        const searchText = query.toLowerCase();
        return (
          idea.title.toLowerCase().includes(searchText) ||
          idea.description.toLowerCase().includes(searchText) ||
          idea.tags?.some(tag => tag.toLowerCase().includes(searchText))
        );
      });
      onSearch(results);
    } else {
      onClear();
    }
  }, [query, ideas, onSearch, onClear]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Salvar no histórico
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      const updated = [searchQuery, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
    
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    onClear();
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Atalho de teclado (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tags populares
  const popularTags = Array.from(
    new Set(ideas.flatMap(idea => idea.tags || []))
  ).slice(0, 5);

  return (
    <div className="relative">
      {/* Input de Busca */}
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Buscar ideias... (Ctrl+K)"
            className="w-full pl-12 pr-24 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={clearSearch}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
            
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded border border-slate-600">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>
        </div>

        {/* Focus ring animado */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isFocused ? 1 : 0,
            boxShadow: isFocused
              ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
              : '0 0 0 0px rgba(99, 102, 241, 0)'
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Sugestões e Histórico */}
      <AnimatePresence>
        {showSuggestions && (isFocused || query) && (
          <motion.div
            className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Histórico de Buscas */}
            {!query && recentSearches.length > 0 && (
              <div className="p-3 border-b border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Buscas Recentes</span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Populares */}
            {!query && popularTags.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Tags Populares</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(tag)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 text-xs rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-all"
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resultados */}
            {query && (
              <div className="p-3">
                <div className="text-xs font-medium text-slate-400 mb-2">
                  {ideas.filter(idea => 
                    idea.title.toLowerCase().includes(query.toLowerCase()) ||
                    idea.description.toLowerCase().includes(query.toLowerCase())
                  ).length} resultados
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
