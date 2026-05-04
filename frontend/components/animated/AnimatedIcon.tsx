'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedIconProps {
  children: ReactNode;
  variant?: 'bounce' | 'rotate' | 'pulse' | 'shake' | 'float';
  hover?: boolean;
  className?: string;
}

export function AnimatedIcon({
  children,
  variant = 'bounce',
  hover = true,
  className = ''
}: AnimatedIconProps) {
  const variants = {
    bounce: {
      hover: { y: -4 },
      tap: { y: 0 }
    },
    rotate: {
      hover: { rotate: 12 },
      tap: { rotate: 0 }
    },
    pulse: {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 }
    },
    shake: {
      hover: { x: [0, -2, 2, -2, 2, 0] },
      tap: { x: 0 }
    },
    float: {
      hover: { y: [-2, 2, -2] },
      tap: { y: 0 }
    }
  };

  return (
    <motion.div
      className={`inline-flex ${className}`}
      whileHover={hover ? variants[variant].hover : undefined}
      whileTap={variants[variant].tap}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {children}
    </motion.div>
  );
}

// Ícone com background animado
export function AnimatedIconBox({
  children,
  gradient = 'from-indigo-500/20 to-purple-500/20',
  className = ''
}: {
  children: ReactNode;
  gradient?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`
        bg-gradient-to-br ${gradient} p-3 rounded-xl
        ${className}
      `}
      whileHover={{
        scale: 1.05,
        rotate: 5
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <motion.div
        whileHover={{ rotate: 12 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Ícone com efeito de loading
export function AnimatedLoadingIcon({
  children,
  loading = false,
  className = ''
}: {
  children: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`inline-flex ${className}`}
      animate={loading ? { rotate: 360 } : { rotate: 0 }}
      transition={loading ? {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      } : {}}
    >
      {children}
    </motion.div>
  );
}
