'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, useState } from 'react';

interface AnimatedInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function AnimatedInput({
  label,
  error,
  icon,
  className = '',
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          className="block text-sm font-medium text-slate-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            animate={{
              color: isFocused ? 'rgb(129, 140, 248)' : 'rgb(100, 116, 139)'
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        <motion.input
          className={`
            w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg
            text-white placeholder:text-slate-500
            focus:outline-none transition-all
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-slate-700'}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            borderColor: error
              ? 'rgb(239, 68, 68)'
              : isFocused
              ? 'rgb(99, 102, 241)'
              : 'rgb(51, 65, 85)'
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Focus ring */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isFocused ? 1 : 0,
            boxShadow: isFocused
              ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
              : '0 0 0 0px rgba(99, 102, 241, 0)'
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {error && (
        <motion.p
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
