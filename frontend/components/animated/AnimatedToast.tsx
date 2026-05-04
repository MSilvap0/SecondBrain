'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function AnimatedToast({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: {
      bg: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/50',
      icon: 'text-emerald-400',
      text: 'text-emerald-300'
    },
    error: {
      bg: 'from-red-500/20 to-pink-500/20',
      border: 'border-red-500/50',
      icon: 'text-red-400',
      text: 'text-red-300'
    },
    warning: {
      bg: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/50',
      icon: 'text-yellow-400',
      text: 'text-yellow-300'
    },
    info: {
      bg: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/50',
      icon: 'text-blue-400',
      text: 'text-blue-300'
    }
  };

  const style = colors[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${style.bg} backdrop-blur-xl
        border ${style.border}
        rounded-xl p-4 shadow-2xl
        min-w-[320px] max-w-md
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className={style.icon}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: 0.1
          }}
        >
          {icons[type]}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.p
            className="text-white font-semibold text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
          {description && (
            <motion.p
              className={`${style.text} text-xs mt-1`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Close button */}
        <motion.button
          onClick={() => onClose(id)}
          className="text-slate-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${style.border.replace('border-', 'bg-')}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

// Toast Container
export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  );
}
