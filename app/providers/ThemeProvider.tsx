'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

type FontFamily = 'sans-serif' | 'mono' | 'serif';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggleDarkMode: () => void;
  prefersReducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('mono');

  // Memoized theme application function
  const applyTheme = useCallback((darkMode: boolean) => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    localStorage.setItem('darkMode', darkMode.toString());
  }, []);

  // Memoized motion preference application
  const applyMotionPreference = useCallback((reducedMotion: boolean) => {
    const html = document.documentElement;

    if (reducedMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }

    localStorage.setItem('prefersReducedMotion', reducedMotion.toString());
  }, []);

  // Memoized font family application
  const applyFontFamily = useCallback((font: FontFamily) => {
    const html = document.documentElement;

    // Remove existing font classes
    html.classList.remove('font-sans', 'font-mono', 'font-serif');

    // Add new font class
    html.classList.add(`font-${font}`);

    localStorage.setItem('fontFamily', font);
  }, []);

  // Initialize theme and motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Theme initialization
    const storedThemePreference = localStorage.getItem('darkMode');
    const darkModeEnabled =
      storedThemePreference === 'true' ||
      (storedThemePreference === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(darkModeEnabled);
    applyTheme(darkModeEnabled);

    if (storedThemePreference === null) {
      localStorage.setItem('darkMode', darkModeEnabled.toString());
    }

    // Motion preference initialization
    const storedMotionPreference = localStorage.getItem('prefersReducedMotion');
    const systemPrefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const reducedMotionEnabled =
      storedMotionPreference === 'true' ||
      (storedMotionPreference === null && systemPrefersReducedMotion);

    setPrefersReducedMotion(reducedMotionEnabled);
    applyMotionPreference(reducedMotionEnabled);

    if (storedMotionPreference === null && systemPrefersReducedMotion) {
      localStorage.setItem('prefersReducedMotion', 'true');
    }

    // Font family initialization
    const storedFontPreference = localStorage.getItem('fontFamily') as FontFamily;
    const defaultFont: FontFamily = 'mono';
    const selectedFont = storedFontPreference || defaultFont;

    setFontFamilyState(selectedFont);
    applyFontFamily(selectedFont);

    if (!storedFontPreference) {
      localStorage.setItem('fontFamily', defaultFont);
    }

    // Listen for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
        applyTheme(e.matches);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('prefersReducedMotion') === null) {
        setPrefersReducedMotion(e.matches);
        applyMotionPreference(e.matches);
      }
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    motionMediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
      motionMediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [applyTheme, applyMotionPreference, applyFontFamily]);

  // Apply theme changes when isDarkMode changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    applyTheme(isDarkMode);

    // Dispatch a custom event for theme change
    const themeChangeEvent = new CustomEvent('themeChange', {
      detail: { isDarkMode },
    });
    window.dispatchEvent(themeChangeEvent);
  }, [isDarkMode, applyTheme]);

  // Apply motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    applyMotionPreference(prefersReducedMotion);

    // Dispatch a custom event for motion preference change
    const motionChangeEvent = new CustomEvent('motionChange', {
      detail: { prefersReducedMotion },
    });
    window.dispatchEvent(motionChangeEvent);
  }, [prefersReducedMotion, applyMotionPreference]);

  // Global keyboard shortcut for theme toggle (Cmd/Ctrl + Shift + T)
  // Memoized toggle functions
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setPrefersReducedMotion((prev) => !prev);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Use Cmd/Ctrl + T for Theme toggle (easier than Shift+D)
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // Font family setter function
  const setFontFamily = useCallback(
    (font: FontFamily) => {
      setFontFamilyState(font);
      applyFontFamily(font);
    },
    [applyFontFamily]
  );

  // Memoized context value to prevent re-renders when children don't need to update
  const contextValue = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      toggleDarkMode: toggleTheme,
      prefersReducedMotion,
      toggleReducedMotion,
      fontFamily,
      setFontFamily,
    }),
    [isDarkMode, toggleTheme, prefersReducedMotion, toggleReducedMotion, fontFamily, setFontFamily]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
