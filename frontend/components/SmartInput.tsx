'use client';

import { Plus, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartInputProps {
  onSubmit: (content: string) => void;
  loading?: boolean;
}

export function SmartInput({ onSubmit, loading = false }: SmartInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !loading) {
      onSubmit(value);
      setValue('');
    }
  };

  const quickSuggestions = [
    { icon: '💡', text: 'App de tarefas', color: 'from-blue-50 to-blue-100' },
    { icon: '🚀', text: 'Projeto pessoal', color: 'from-purple-50 to-purple-100' },
    { icon: '💼', text: 'Ideia de negócio', color: 'from-green-50 to-green-100' },
    { icon: '🎨', text: 'Projeto criativo', color: 'from-pink-50 to-pink-100' }
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`ui-card rounded-2xl p-8 transition-all duration-300 ${
          isFocused ? 'ring-2 ring-indigo-500 shadow-2xl' : 'shadow-lg'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Wand2 className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl tracking-tight">Nova Ideia</h3>
            <p className="text-zinc-400 text-sm font-light">
              A IA vai expandir automaticamente suas possibilidades
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <motion.textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Digite sua ideia aqui... Ex: Criar um app de produtividade com gamificação"
              className="w-full px-5 py-4 ui-input transition-all resize-none font-light leading-relaxed"
              disabled={loading}
              rows={3}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
            
            <AnimatePresence>
              {value.length > 0 && (
                <motion.div
                  className="absolute right-4 bottom-4 text-xs text-zinc-500 font-tabular bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {value.length} caracteres
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <motion.button
            type="submit"
            disabled={loading || !value.trim()}
            className="w-full ui-btn ui-btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: loading || !value.trim() ? 1 : 1.02 }}
            whileTap={{ scale: loading || !value.trim() ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <span>Processando com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Adicionar e Expandir com IA</span>
                <Plus className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Quick Suggestions */}
        <AnimatePresence>
          {!value && !loading && (
            <motion.div
              className="mt-6 pt-6 border-t border-zinc-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-zinc-500 mb-3 font-medium tracking-wide uppercase">
                Sugestões Rápidas
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {quickSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.text}
                    type="button"
                    onClick={() => setValue(suggestion.text)}
                    className={`px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 text-white text-sm rounded-xl transition-all border border-zinc-700 hover:border-zinc-600 text-left`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg mb-1 block">{suggestion.icon}</span>
                    <span className="font-medium">{suggestion.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow effect when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-black opacity-5 blur-2xl -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.form>
  );
}
