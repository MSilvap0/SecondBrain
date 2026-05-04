'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: ReactNode;
  hover?: boolean;
  delay?: number;
}

export function AnimatedCard({
  children,
  hover = true,
  delay = 0,
  className = '',
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      className={`
        relative glass-effect rounded-2xl p-6 border border-slate-800/50
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
        borderColor: 'rgba(99, 102, 241, 0.5)'
      } : undefined}
      {...props}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine" />
      </motion.div>
    </motion.div>
  );
}

// Variante para cards clicáveis
export function AnimatedClickableCard({
  children,
  onClick,
  delay = 0,
  className = '',
  ...props
}: AnimatedCardProps & { onClick?: () => void }) {
  return (
    <motion.div
      className={`
        relative glass-effect rounded-2xl p-6 border border-slate-800/50
        cursor-pointer
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
        borderColor: 'rgba(99, 102, 241, 0.5)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
