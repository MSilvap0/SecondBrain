'use client';

import { motion } from 'framer-motion';
import { IdeaCard } from './IdeaCard';
import type { Idea } from '@/types/idea';
import { Lightbulb, Star, CheckCircle } from 'lucide-react';

interface KanbanViewProps {
  ideas: Idea[];
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onAIExpand?: (id: number) => void;
}

type Column = 'backlog' | 'favorites' | 'expanded';

export function KanbanView({ ideas, onDelete, onToggleFavorite, onAIExpand }: KanbanViewProps) {
  const columns: { id: Column; title: string; icon: any; color: string }[] = [
    {
      id: 'backlog',
      title: 'Ideias',
      icon: Lightbulb,
      color: 'from-slate-500/20 to-slate-600/20'
    },
    {
      id: 'favorites',
      title: 'Favoritas',
      icon: Star,
      color: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'expanded',
      title: 'Expandidas',
      icon: CheckCircle,
      color: 'from-emerald-500/20 to-teal-500/20'
    },
  ];

  const getColumnIdeas = (columnId: Column): Idea[] => {
    switch (columnId) {
      case 'backlog':
        return ideas.filter(idea => !idea.isFavorite && !idea.expanded);
      case 'favorites':
        return ideas.filter(idea => idea.isFavorite);
      case 'expanded':
        return ideas.filter(idea => idea.expanded);
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column, columnIndex) => {
        const columnIdeas = getColumnIdeas(column.id);
        const Icon = column.icon;

        return (
          <motion.div
            key={column.id}
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columnIndex * 0.1 }}
          >
            {/* Column Header */}
            <div className={`bg-gradient-to-br ${column.color} rounded-xl p-4 mb-4 border border-slate-800/50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900/50 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{column.title}</h3>
                    <p className="text-slate-400 text-sm">{columnIdeas.length} ideias</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-4 min-h-[200px]">
              {columnIdeas.length === 0 ? (
                <div className="glass-effect rounded-xl p-8 text-center border border-slate-800/50">
                  <Icon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    Nenhuma ideia aqui
                  </p>
                </div>
              ) : (
                columnIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <IdeaCard
                      {...idea}
                      onDelete={onDelete}
                      onToggleFavorite={onToggleFavorite}
                      onAIExpand={onAIExpand}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
