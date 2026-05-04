"use client";

import { Lightbulb, Star, Trash2, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { Idea } from '@/types/idea';

interface IdeaListProps {
  ideas: Idea[];
  onDelete?: (id: string | number) => void;
  onToggleFavorite?: (id: string | number) => void;
  onAIExpand?: (id: string | number) => void;
  onSelect?: (id: string | number) => void;
}

export function IdeaList({
  ideas,
  onDelete,
  onToggleFavorite,
  onAIExpand,
  onSelect
}: IdeaListProps) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  return (
    <div className="space-y-3">
      {ideas.map((idea, index) => (
        <div
          key={idea.id}
          className="group relative bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 hover:bg-slate-900/80 animate-slide-up cursor-pointer"
          style={{ animationDelay: `${index * 30}ms` }}
          onClick={() => onSelect?.(idea.id)}
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-2 rounded-lg group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="text-white font-medium text-sm line-clamp-1">
                  {idea.title}
                </h4>
                {idea.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(idea.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-xs line-clamp-1">
                {idea.description}
              </p>

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {idea.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-800/50 text-slate-500 text-xs rounded border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {idea.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-slate-500 text-xs">
                      +{idea.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {idea.expanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAIExpand?.(idea.id);
                  }}
                  className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                  aria-label="Expandir com IA"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(idea.id);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  idea.isFavorite 
                    ? 'text-yellow-400 bg-yellow-400/10' 
                    : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800/50'
                }`}
                aria-label={idea.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Star className="w-3.5 h-3.5" fill={idea.isFavorite ? 'currentColor' : 'none'} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(idea.id);
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                aria-label="Deletar ideia"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors ml-1" />
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-transparent group-hover:from-indigo-500/5 group-hover:via-purple-500/5 transition-all duration-500 pointer-events-none rounded-xl" />
        </div>
      ))}
    </div>
  );
}
