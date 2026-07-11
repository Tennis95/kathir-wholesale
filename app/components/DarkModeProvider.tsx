'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type DarkModeType = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  mode: DarkModeType;
  isDark: boolean;
  setMode: (mode: DarkModeType) => void;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DarkModeType>('system');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage and system preference
  useEffect(() => {
    const stored = localStorage.getItem('kathir-theme') as DarkModeType | null;
    const initialMode = stored || 'system';
    setModeState(initialMode);

    // Determine if dark mode should be active
    const prefersDark =
      initialMode === 'dark' ||
      (initialMode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(prefersDark);
    applyTheme(prefersDark);
    setMounted(true);
  }, []);

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (mode === 'system') {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.style.background = '#1a1a1a';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.style.background = '#ffffff';
    }
  };

  const setMode = (newMode: DarkModeType) => {
    setModeState(newMode);
    localStorage.setItem('kathir-theme', newMode);

    const shouldBeDark =
      newMode === 'dark' ||
      (newMode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  };

  const toggleDarkMode = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <DarkModeContext.Provider
      value={{
        mode,
        isDark,
        setMode,
        toggleDarkMode,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode(): DarkModeContextType {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    // Return a fallback context for SSR
    return {
      mode: 'system',
      isDark: false,
      setMode: () => {},
      toggleDarkMode: () => {},
    };
  }
  return context;
}
