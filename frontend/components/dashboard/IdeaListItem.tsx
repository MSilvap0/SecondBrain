'use client';

import { Lightbulb, Star, Sparkles, Calendar } from 'lucide-react';

interface IdeaListItemProps {
  id: string | number;
  title: string;
  description: string;
  createdAt?: Date | string;
  isFavorite?: boolean;
  expanded?: boolean;
  onClick: () => void;
  delay?: number;
}

export function IdeaListItem({
  id,
  title,
  description,
  createdAt,
  isFavorite,
  expanded,
  onClick,
}: IdeaListItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-lg border border-neutral-800/40 hover:border-neutral-700 bg-neutral-900/20 hover:bg-neutral-900/40 transition-colors cursor-pointer"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-neutral-800/40 rounded-lg flex items-center justify-center">
        <Lightbulb className="w-4 h-4 text-neutral-400" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-white truncate">
            {title}
          </h3>
          {isFavorite && (
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
          )}
          {expanded && (
            <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-neutral-500 truncate mb-1.5">
          {description}
        </p>
        {createdAt && (
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <Calendar className="w-3 h-3" />
            {new Date(createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        )}
      </div>
    </div>
  );
}
