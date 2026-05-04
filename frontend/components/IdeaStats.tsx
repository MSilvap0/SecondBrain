'use client';

import { Lightbulb, Sparkles, TrendingUp, Star } from 'lucide-react';
import type { Idea } from '@/types/idea';

interface IdeaStatsProps {
  ideas: Idea[];
}

export function IdeaStats({ ideas }: IdeaStatsProps) {
  const totalIdeas = ideas.length;
  const favoritesCount = ideas.filter(idea => idea.isFavorite).length;
  const expandedCount = ideas.filter(idea => idea.expanded).length;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekCount = ideas.filter(idea => 
    idea.createdAt && new Date(idea.createdAt) >= oneWeekAgo
  ).length;

  const stats = [
    {
      label: 'Total de Ideias',
      value: totalIdeas,
      icon: Lightbulb,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      label: 'Processadas por IA',
      value: expandedCount,
      icon: Sparkles,
      iconColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      label: 'Favoritas',
      value: favoritesCount,
      icon: Star,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      label: 'Esta Semana',
      value: thisWeekCount,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.label}
            className={`ui-card p-6 hover:scale-105 transition-all cursor-pointer ${stat.borderColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-zinc-400 font-medium mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-white font-tabular">
                  {stat.value}
                </p>
              </div>
              
              <div className={`${stat.bgColor} p-3 rounded-xl border ${stat.borderColor}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
