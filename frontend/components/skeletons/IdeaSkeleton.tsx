'use client';

interface IdeaCardSkeletonProps {
  variant?: 'default' | 'compact' | 'expanded';
}

export function IdeaCardSkeleton({ variant = 'default' }: IdeaCardSkeletonProps) {
  const heights = {
    compact: 'h-20',
    default: 'h-32',
    expanded: 'h-48',
  };

  return (
    <div className={`bg-slate-900/50 rounded-xl border border-slate-800 p-5 animate-pulse ${heights[variant]}`}>
      {/* Title */}
      <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-4" />
      
      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-700/30 rounded" />
        <div className="h-4 bg-slate-700/30 rounded w-5/6" />
        {variant !== 'compact' && (
          <>
            <div className="h-4 bg-slate-700/30 rounded w-4/6" />
            <div className="h-4 bg-slate-700/30 rounded w-3/6" />
          </>
        )}
      </div>

      {/* Tags */}
      {variant !== 'compact' && (
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-slate-700/30 rounded-full" />
          <div className="h-6 w-20 bg-slate-700/30 rounded-full" />
          <div className="h-6 w-12 bg-slate-700/30 rounded-full" />
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
        <div className="h-4 w-24 bg-slate-700/30 rounded" />
        <div className="h-8 w-8 bg-slate-700/30 rounded-full" />
      </div>
    </div>
  );
}

export function IdeaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <IdeaCardSkeleton key={i} variant={i === 0 ? 'expanded' : 'default'} />
      ))}
    </div>
  );
}

export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="w-8 h-8 bg-slate-700/30 rounded-full flex-shrink-0 animate-pulse" />
      
      {/* Message Bubble */}
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`bg-slate-800/50 rounded-2xl p-4 animate-pulse ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
          <div className="h-4 bg-slate-700/30 rounded w-32 mb-2" />
          <div className="h-4 bg-slate-700/30 rounded w-48 mb-2" />
          <div className="h-4 bg-slate-700/30 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-800/30 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 animate-pulse">
      <div className="h-4 w-24 bg-slate-700/30 rounded mb-3" />
      <div className="h-8 w-16 bg-slate-700/50 rounded" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-800 animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-700/30 rounded" style={{ width: `${20 + Math.random() * 60}%` }} />
      ))}
    </div>
  );
}

export function LoadingOverlay({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}
