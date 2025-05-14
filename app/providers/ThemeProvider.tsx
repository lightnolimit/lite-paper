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
    if (typeof window !== 'undefined') {
      const initializeTheme = () => {
        // Check localStorage first
        const storedPreference = localStorage.getItem('darkMode');
        
        if (storedPreference !== null) {
          // Use stored preference if available
          const darkModeEnabled = storedPreference === 'true';
          setIsDarkMode(darkModeEnabled);
          
          // Apply theme class
          if (darkModeEnabled) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else {
          // Use system preference as fallback
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(prefersDark);
          localStorage.setItem('darkMode', prefersDark ? 'true' : 'false');
          
          // Apply theme class
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        setIsInitialized(true);
      };
      
      initializeTheme();
    }
  }, []);
  
  // Effect to apply theme changes
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;
    
    const html = document.documentElement;
    
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
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