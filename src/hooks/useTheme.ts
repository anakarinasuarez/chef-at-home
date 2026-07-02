'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'chef-theme';

/**
 * Reads/writes the app theme via the `data-theme` attribute on <html>.
 * The initial theme is applied before paint by the inline script in the
 * root layout, so this hook only syncs React state and handles toggling.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark';
    setThemeState(current);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
