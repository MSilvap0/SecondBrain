'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'midnight' | 'ocean' | 'forest' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme configurations
const themeConfigs = {
  midnight: {
    name: 'Midnight',
    colors: {
      primary: 'blue',
      accent: 'purple',
      background: '#0a0a0b',
      surface: '#171717',
    },
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: 'cyan',
      accent: 'teal',
      background: '#0c1929',
      surface: '#132f4c',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: 'emerald',
      accent: 'green',
      background: '#071a12',
      surface: '#0a2917',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: 'orange',
      accent: 'red',
      background: '#1a0a0a',
      surface: '#2a0f0f',
    },
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('midnight');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && themeConfigs[saved]) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    const config = themeConfigs[theme];
    document.documentElement.style.setProperty('--theme-primary', config.colors.primary);
    document.documentElement.style.setProperty('--theme-accent', config.colors.accent);
    document.documentElement.style.setProperty('--theme-background', config.colors.background);
    document.documentElement.style.setProperty('--theme-surface', config.colors.surface);
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: Object.keys(themeConfigs) as Theme[] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { themeConfigs };
