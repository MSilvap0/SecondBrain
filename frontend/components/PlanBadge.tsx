'use client';

import { Crown, Zap, Building2 } from 'lucide-react';

interface PlanBadgeProps {
  plan: 'free' | 'pro' | 'enterprise';
  size?: 'sm' | 'md' | 'lg';
}

export function PlanBadge({ plan, size = 'md' }: PlanBadgeProps) {
  const configs = {
    free: {
      label: 'Free',
      icon: Zap,
      colors: 'bg-neutral-800 text-neutral-300 border-neutral-700'
    },
    pro: {
      label: 'Pro',
      icon: Crown,
      colors: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
    },
    enterprise: {
      label: 'Enterprise',
      icon: Building2,
      colors: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const config = configs[plan];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} ${config.colors} rounded-lg font-semibold border`}>
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </div>
  );
}
