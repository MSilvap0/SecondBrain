'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  iconColor,
  change,
  trend,
}: MetricCardProps) {
  return (
    <div className="bg-neutral-900/50 rounded-lg border border-neutral-800/40 p-4 hover:border-neutral-700 transition-colors">
      <div className="space-y-3">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between">
          <div className={`p-2 ${iconColor} rounded-lg`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          {change && trend !== 'neutral' && (
            <div className={`px-2 py-0.5 rounded-md text-xs font-bold ${
              trend === 'up' 
                ? 'bg-emerald-500/15 text-emerald-400' 
                : 'bg-red-500/15 text-red-400'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {change}%
            </div>
          )}
        </div>

        {/* Value & Label */}
        <div className="space-y-0.5">
          <p className="text-2xl font-bold text-white">
            {value}
          </p>
          <p className="text-xs text-neutral-500 font-light">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
