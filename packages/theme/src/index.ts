export const STORAGE_KEY = 'fitquest-theme';

export type Theme = 'light' | 'dark';

export const brand = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
  950: '#450A0A',
} as const;

export const semanticColors = {
  light: {
    bg: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      elevated: '#ffffff',
      inverse: '#111827',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#f9fafb',
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      focus: '#EF4444',
    },
  },
  dark: {
    bg: {
      primary: '#0a0a0a',
      secondary: '#111111',
      tertiary: '#1a1a1a',
      elevated: '#161616',
      inverse: '#f9fafb',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      muted: '#6b7280',
      inverse: '#111827',
    },
    border: {
      primary: '#262626',
      secondary: '#333333',
      focus: '#EF4444',
    },
  },
} as const;

export const gamificationColors = {
  xp: '#f59e0b',
  streak: '#f97316',
  level: '#8b5cf6',
  rarity: {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  },
} as const;

export const statusColors = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

/**
 * Get the initial theme from localStorage or system preference.
 */
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Apply theme to the document root and persist to localStorage.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  localStorage.setItem(STORAGE_KEY, theme);
}
