'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { IdeaGrid } from '@/components/IdeaGrid';
import { motion } from 'framer-motion';
import { Star, Search, Heart } from 'lucide-react';
import type { Idea } from '@/types/idea';

export default function FavoritesPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/ideas', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar ideias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/ideas/${String(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIdeas(ideas.filter(idea => idea.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar ideia:', error);
    }
  };

  const handleToggleFavorite = async (id: string | number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/ideas/${String(id)}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedIdea = await response.json();
        setIdeas(ideas.map(idea => idea.id === id ? updatedIdea : idea));
      }
    } catch (error) {
      console.error('Erro ao favoritar ideia:', error);
    }
  };

  const favorites = ideas.filter(idea => idea.isFavorite);
  const filteredFavorites = favorites.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Ideias Favoritas
                </h1>
                <p className="text-zinc-400">
                  {favorites.length} {favorites.length === 1 ? 'ideia favorita' : 'ideias favoritas'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search Premium */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-md"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar nas favoritas..."
                  className="w-full pl-12 pr-4 py-3 ui-input"
                />
              </div>
            </motion.div>
          )}

          {/* Ideas Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-3 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                  <p className="text-zinc-400">Carregando favoritas...</p>
                </div>
              </div>
            ) : filteredFavorites.length > 0 ? (
              <IdeaGrid
                ideas={filteredFavorites}
                loading={false}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                emptyMessage="Nenhuma favorita ainda"
                emptyDescription="Marque suas melhores ideias como favoritas!"
              />
            ) : (
              <div className="text-center py-20 ui-card">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                    <Heart className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {searchQuery ? 'Nenhuma favorita encontrada' : 'Nenhuma favorita ainda'}
                  </h3>
                  <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? 'Tente buscar com outros termos ou limpe a busca'
                      : 'Marque suas melhores ideias como favoritas clicando na estrela!'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ui-btn ui-btn-secondary"
                    >
                      Limpar busca
                    </button>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
