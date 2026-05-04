"use client";

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy-load AIChat to improve initial bundle
const AIChat = dynamic(() => import('./AIChat').then((mod) => mod.AIChat), {
  ssr: false,
  loading: () => <div className="p-4">Carregando chat...</div>
});

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdea?: string;
  onSaveExpansion?: (expansion: string) => void;
}

export function AIChatModal({ isOpen, onClose, initialIdea, onSaveExpansion }: AIChatModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-4xl h-[80vh]"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AIChat
                initialIdea={initialIdea}
                onClose={onClose}
                onSaveExpansion={(expansion) => {
                  onSaveExpansion?.(expansion);
                  onClose();
                }}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
