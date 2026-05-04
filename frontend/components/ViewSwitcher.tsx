'use client';

import { motion } from 'framer-motion';
import { Grid3x3, List, Kanban } from 'lucide-react';

export type ViewMode = 'grid' | 'list' | 'kanban';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: { mode: ViewMode; icon: any; label: string }[] = [
    { mode: 'grid', icon: Grid3x3, label: 'Grade' },
    { mode: 'list', icon: List, label: 'Lista' },
    { mode: 'kanban', icon: Kanban, label: 'Kanban' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
      {views.map(({ mode, icon: Icon, label }) => (
        <motion.button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={`relative px-3 py-2 rounded-md transition-all ${
            currentView === mode
              ? 'text-white'
              : 'text-slate-400 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={label}
        >
          {currentView === mode && (
            <motion.div
              className="absolute inset-0 bg-indigo-500/20 rounded-md border border-indigo-500/50"
              layoutId="activeView"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
            />
          )}
          <Icon className="w-4 h-4 relative z-10" />
        </motion.button>
      ))}
    </div>
  );
}
