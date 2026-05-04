'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Star, Trash2, Sparkles, ChevronDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  expanded?: {
    expandedContent: string;
    suggestions?: string[];
    relatedTopics?: string[];
  };
  isFavorite?: boolean;
  tags?: string[];
  createdAt?: Date | string;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onAIExpand?: (id: string) => void;
}

export function IdeaCard({ 
  id,
  title,
  description,
  expanded, 
  isFavorite = false,
  tags = [],
  createdAt,
  onDelete,
  onToggleFavorite,
  onAIExpand
}: IdeaCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAIExpand = async () => {
    if (expanded) {
      setIsExpanded(!isExpanded);
    } else {
      setIsProcessing(true);
      await onAIExpand?.(id);
      setIsProcessing(false);
      setIsExpanded(true);
    }
  };

  return (
    <article className="bg-neutral-900/50 rounded-lg border border-neutral-800 p-5 hover:border-neutral-700 hover:shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white leading-tight mb-1 line-clamp-2">
            {title}
          </h3>
          {createdAt && (
            <time className="text-xs text-neutral-500">
              {new Date(createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </time>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite?.(id)}
            className={`p-1.5 rounded-md transition-colors ${
              isFavorite 
                ? 'text-yellow-400 bg-yellow-500/10' 
                : 'text-neutral-500 hover:text-yellow-400 hover:bg-yellow-500/10'
            }`}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={() => onDelete?.(id)}
            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            aria-label="Deletar ideia"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-neutral-300 text-sm leading-relaxed mb-3 line-clamp-2">
        {description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAIExpand}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-card text-on-surface rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 transition-colors"
        >
          {isProcessing ? (
            <>
              <div className="w-3 h-3 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{expanded ? (isExpanded ? 'Ocultar' : 'Ver') : 'Expandir'}</span>
            </>
          )}
        </button>

        <button
          onClick={() => router.push(`/chat/${id}`)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-md text-xs font-medium text-white hover:bg-neutral-700 hover:border-neutral-600 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
          <div className="bg-neutral-800/50 rounded-md p-3 border border-neutral-700">
            <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
              {expanded.expandedContent}
            </p>
          </div>

          {expanded.suggestions && expanded.suggestions.length > 0 && (
            <div className="bg-blue-500/10 rounded-md p-3 border border-blue-500/20">
              <p className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                <span>💡</span>
                Sugestões da IA
              </p>
              <ul className="space-y-1.5">
                {expanded.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-neutral-300 text-xs flex items-start gap-2">
                    <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expanded.relatedTopics && expanded.relatedTopics.length > 0 && (
            <div className="bg-green-500/10 rounded-md p-3 border border-green-500/20">
              <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1.5">
                <span>🔗</span>
                Tópicos Relacionados
              </p>
              <div className="flex flex-wrap gap-1.5">
                {expanded.relatedTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-neutral-800 text-green-400 text-xs font-medium rounded-md border border-green-500/20 hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
