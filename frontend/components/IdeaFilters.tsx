'use client';

import { Filter, X, Star, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';

interface IdeaFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  availableTags?: string[];
}

export interface FilterState {
  showFavorites: boolean;
  selectedTags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'recent' | 'oldest' | 'title';
}

export function IdeaFilters({ onFilterChange, availableTags = [] }: IdeaFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    showFavorites: false,
    selectedTags: [],
    dateRange: 'all',
    sortBy: 'recent'
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    updateFilters({ selectedTags: newTags });
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      showFavorites: false,
      selectedTags: [],
      dateRange: 'all',
      sortBy: 'recent'
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    (filters.showFavorites ? 1 : 0) +
    filters.selectedTags.length +
    (filters.dateRange !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'recent' ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-700"
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-400" />
                <h3 className="text-white font-semibold">Filtros</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Favorites */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.showFavorites}
                    onChange={(e) => updateFilters({ showFavorites: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      Apenas favoritas
                    </span>
                  </div>
                </label>
              </div>

              {/* Date Range */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-300">Período</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'Todas' },
                    { value: 'today', label: 'Hoje' },
                    { value: 'week', label: 'Esta semana' },
                    { value: 'month', label: 'Este mês' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilters({ dateRange: option.value as any })}
                      className={`px-3 py-2 text-xs rounded-lg transition-all ${
                        filters.dateRange === option.value
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                          : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {availableTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <label className="text-sm font-medium text-slate-300">Tags</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                          filters.selectedTags.includes(tag)
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="recent">Mais recentes</option>
                  <option value="oldest">Mais antigas</option>
                  <option value="title">Título (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            {activeFiltersCount > 0 && (
              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
