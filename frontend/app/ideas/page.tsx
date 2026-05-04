'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { IdeaGrid } from '@/components/IdeaGrid';
import { IdeaFilters, FilterState } from '@/components/IdeaFilters';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Search, Sparkles } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api';
import { apiGet, apiPost, apiDelete, apiPut } from '@/utils/api.utils';
import type { Idea } from '@/types/idea';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newIdeaText, setNewIdeaText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const { data } = await apiGet<Idea[]>(API_ENDPOINTS.IDEAS);
      setIdeas(data);
      setFilteredIdeas(data);
    } catch (error) {
      console.error('Erro ao carregar ideias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...ideas];

    if (searchQuery) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.showFavorites) {
      filtered = filtered.filter(idea => idea.isFavorite);
    }

    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(idea =>
        idea.tags?.some(tag => filters.selectedTags.includes(tag))
      );
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const ranges = { today: 1, week: 7, month: 30 };
      const days = ranges[filters.dateRange];
      const cutoff = new Date(now.setDate(now.getDate() - days));
      
      filtered = filtered.filter(idea =>
        idea.createdAt && new Date(idea.createdAt) >= cutoff
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
        case 'oldest':
          return (new Date(a.createdAt || 0).getTime()) - (new Date(b.createdAt || 0).getTime());
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredIdeas(filtered);
  };

  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim() || submitting) return;

    setSubmitting(true);
    
    try {
      const lines = newIdeaText.split('\n').filter(line => line.trim());
      const title = lines[0] || newIdeaText.substring(0, 50);
      const description = lines.length > 1 ? lines.slice(1).join('\n') : newIdeaText;

      const { data: newIdea } = await apiPost<Idea>(API_ENDPOINTS.IDEAS, {
        title,
        description,
        tags: []
      });

      setIdeas([newIdea, ...ideas]);
      setFilteredIdeas([newIdea, ...filteredIdeas]);
      setNewIdeaText('');
    } catch (error) {
      console.error('Erro ao adicionar ideia:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await apiDelete(API_ENDPOINTS.IDEA_BY_ID(String(id)));
      setIdeas(ideas.filter(idea => idea.id !== id));
      setFilteredIdeas(filteredIdeas.filter(idea => idea.id !== id));
    } catch (error) {
      console.error('Erro ao deletar ideia:', error);
    }
  };

  const handleToggleFavorite = async (id: string | number) => {
    try {
      const { data: updatedIdea } = await apiPost<Idea>(`${API_ENDPOINTS.IDEA_BY_ID(String(id))}/favorite`, {});
      
      const update = (list: Idea[]) =>
        list.map(idea => idea.id === id ? updatedIdea : idea);
      
      setIdeas(update(ideas));
      setFilteredIdeas(update(filteredIdeas));
    } catch (error) {
      console.error('Erro ao favoritar ideia:', error);
    }
  };

  const allTags = Array.from(
    new Set(ideas.flatMap(idea => idea.tags || []))
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen ui-shell">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-8">
          {/* Header Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Minhas Ideias
                </h1>
                <p className="text-zinc-400">
                  {ideas.length} {ideas.length === 1 ? 'ideia capturada' : 'ideias capturadas'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* New Idea Form Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ui-card p-6"
          >
            <form onSubmit={handleAddIdea} className="space-y-4">
              <div className="relative">
                <Sparkles className="absolute left-4 top-4 w-5 h-5 text-indigo-400" />
                <textarea
                  value={newIdeaText}
                  onChange={(e) => setNewIdeaText(e.target.value)}
                  placeholder="Digite sua nova ideia... A IA vai ajudar a expandir!"
                  className="ui-input resize-none pl-12"
                  rows={3}
                  disabled={submitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Pressione <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">Enter</kbd> para criar
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || !newIdeaText.trim()}
                  className="ui-btn ui-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Criar Ideia
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Search and Filters Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row items-start lg:items-center gap-4"
          >
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleFilterChange({
                      showFavorites: false,
                      selectedTags: [],
                      dateRange: 'all',
                      sortBy: 'recent'
                    });
                  }}
                  placeholder="Buscar ideias..."
                  className="w-full pl-12 pr-4 py-3 ui-input"
                />
              </div>
            </div>

            <IdeaFilters
              onFilterChange={handleFilterChange}
              availableTags={allTags}
            />
          </motion.div>

          {/* Ideas Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <IdeaGrid
              ideas={filteredIdeas}
              loading={loading}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              emptyMessage={ideas.length === 0 ? "Nenhuma ideia ainda" : "Nenhuma ideia encontrada"}
              emptyDescription={ideas.length === 0 ? "Comece adicionando sua primeira ideia acima!" : "Tente ajustar os filtros"}
            />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
