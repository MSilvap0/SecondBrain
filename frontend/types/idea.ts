export interface Idea {
  id: string | number;
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
  updatedAt?: Date | string;
}

export interface IdeaCardProps extends Idea {
  onDelete?: (id: string | number) => void;
  onToggleFavorite?: (id: string | number) => void;
  onAIExpand?: (id: string | number) => void;
}

export interface IdeaGridProps {
  ideas: Idea[];
  loading?: boolean;
  onDelete?: (id: string | number) => void;
  onToggleFavorite?: (id: string | number) => void;
  onAIExpand?: (id: string | number) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export interface IdeaListProps {
  ideas: Idea[];
  onDelete?: (id: string | number) => void;
  onToggleFavorite?: (id: string | number) => void;
  onAIExpand?: (id: string | number) => void;
  onSelect?: (id: string | number) => void;
}
