'use client';

import { useTheme, themeConfigs } from '@/contexts/ThemeContext';
import { Check, Moon, Waves, TreePine, Sunset } from 'lucide-react';

const themeIcons = {
  midnight: Moon,
  ocean: Waves,
  forest: TreePine,
  sunset: Sunset,
};

const themeColors = {
  midnight: 'from-blue-500 to-purple-500',
  ocean: 'from-cyan-500 to-teal-500',
  forest: 'from-emerald-500 to-green-500',
  sunset: 'from-orange-500 to-red-500',
};

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, themes } = useTheme();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {themes.map((t) => {
          const Icon = themeIcons[t];
          const isActive = theme === t;
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`p-2 rounded-lg transition-all ${
                isActive
                  ? `bg-gradient-to-r ${themeColors[t]} text-white`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={themeConfigs[t].name}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-400 mb-3">Escolha um tema</p>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((t) => {
          const Icon = themeIcons[t];
          const isActive = theme === t;
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-slate-800 border border-blue-500'
                  : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${themeColors[t]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">
                {themeConfigs[t].name}
              </span>
              {isActive && <Check className="w-4 h-4 ml-auto text-blue-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  const Icon = themeIcons[theme];

  return (
    <button
      onClick={() => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
      }}
      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
      title={`Tema: ${themeConfigs[theme].name}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
