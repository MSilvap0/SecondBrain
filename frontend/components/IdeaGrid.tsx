'use client';

import { IdeaCard } from './IdeaCard';
import { Lightbulb, Filter, SortAsc } from 'lucide-react';
import type { Idea } from '@/types/idea';

interface IdeaGridProps {
  ideas: Idea[];
  loading?: boolean;
  onDelete?: (id: string | number) => void;
  onToggleFavorite?: (id: string | number) => void;
  onAIExpand?: (id: string | number) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function IdeaGrid({
  ideas,
  loading = false,
  onDelete,
  onToggleFavorite,
  onAIExpand,
  emptyMessage = 'Nenhuma ideia ainda',
  emptyDescription = 'Adicione sua primeira ideia e deixe a IA organizar automaticamente!'
}: IdeaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-neutral-800 rounded w-3/4" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-neutral-800 rounded" />
              <div className="h-4 bg-neutral-800 rounded w-5/6" />
            </div>
            <div className="h-10 bg-neutral-800 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="bg-neutral-800/50 p-8 rounded-lg">
            <Lightbulb className="w-20 h-20 text-neutral-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-2xl mb-2">
              {emptyMessage}
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              {emptyDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">Suas Ideias</h3>
          <p className="text-sm text-neutral-400 mt-1">
            {ideas.length} {ideas.length === 1 ? 'ideia' : 'ideias'} no total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800 hover:border-neutral-700">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800 hover:border-neutral-700">
            <SortAsc className="w-4 h-4" />
            <span className="hidden sm:inline">Ordenar</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea, index) => (
          <IdeaCard
            key={idea.id}
            {...idea}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onAIExpand={onAIExpand}
          />
        ))}
      </div>
    </div>
  );
}
