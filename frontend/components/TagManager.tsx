'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Hash, Check } from 'lucide-react';
import { AnimatedButton } from './animated/AnimatedButton';

interface Tag {
  name: string;
  color: string;
}

interface TagManagerProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
  onCreateTag?: (tag: string) => void;
}

const TAG_COLORS = [
  { name: 'Indigo', value: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' },
  { name: 'Purple', value: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  { name: 'Pink', value: 'bg-pink-500/20 text-pink-400 border-pink-500/50' },
  { name: 'Blue', value: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  { name: 'Green', value: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
  { name: 'Yellow', value: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
  { name: 'Red', value: 'bg-red-500/20 text-red-400 border-red-500/50' },
  { name: 'Orange', value: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
];

export function TagManager({ selectedTags, availableTags, onTagsChange, onCreateTag }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleCreateTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      onCreateTag?.(newTag.trim());
      onTagsChange([...selectedTags, newTag.trim()]);
      setNewTag('');
      setShowCreateForm(false);
    }
  };

  const getTagColor = (index: number) => {
    return TAG_COLORS[index % TAG_COLORS.length].value;
  };

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-3">
        <AnimatePresence>
          {selectedTags.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getTagColor(availableTags.indexOf(tag))}`}
            >
              <Hash className="w-3 h-3" />
              <span>{tag}</span>
              <motion.button
                onClick={() => toggleTag(tag)}
                className="hover:bg-white/10 rounded p-0.5 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Tag Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-3 h-3" />
          <span>Adicionar Tag</span>
        </motion.button>
      </div>

      {/* Tag Selector Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Gerenciar Tags</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Create New Tag */}
                {showCreateForm ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                      placeholder="Nome da tag..."
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <AnimatedButton
                      size="sm"
                      variant="primary"
                      onClick={handleCreateTag}
                      disabled={!newTag.trim()}
                    >
                      <Check className="w-4 h-4" />
                    </AnimatedButton>
                    <AnimatedButton
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewTag('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar nova tag</span>
                  </button>
                )}
              </div>

              {/* Available Tags */}
              <div className="p-4 max-h-64 overflow-y-auto">
                {availableTags.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4">
                    Nenhuma tag disponível
                  </p>
                ) : (
                  <div className="space-y-1">
                    {availableTags.map((tag, index) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                            isSelected
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-transparent'
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5" />
                            <span>{tag}</span>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
