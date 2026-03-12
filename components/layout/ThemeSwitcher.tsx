'use client';

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Check initial theme and sync <html> class
    const savedTheme = localStorage.getItem('theme');
    const isDark =
      savedTheme === 'dark' ||
      (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="hover:bg-orange-100 dark:hover:bg-sidebar-accent rounded-md p-2 transition-colors text-orange-700 dark:text-sidebar-foreground"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
