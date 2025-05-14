'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check localStorage first
    const storedPreference = localStorage.getItem('darkMode');
    
    // Apply theme based on stored preference or system preference
    const darkModeEnabled = storedPreference === 'true' || 
      (storedPreference === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(darkModeEnabled);
    applyTheme(darkModeEnabled);
    
    if (storedPreference === null) {
      localStorage.setItem('darkMode', darkModeEnabled.toString());
    }
    
    setIsInitialized(true);
  }, []);
  
  // Apply theme to document and localStorage
  const applyTheme = (darkMode: boolean) => {
    const html = document.documentElement;
    
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', darkMode.toString());
  };
  
  // Effect to apply theme changes
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;
    
    applyTheme(isDarkMode);
    
    // Dispatch a custom event for theme change
    const themeChangeEvent = new CustomEvent('themeChange', { 
      detail: { isDarkMode }
    });
    window.dispatchEvent(themeChangeEvent);
  }, [isDarkMode, isInitialized]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 