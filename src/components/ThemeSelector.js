import React, { useState } from 'react';
import { Palette, Moon, Sun } from 'lucide-react';

const themes = {
  light: {
    name: 'Clair',
    primary: '#3B82F6',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1F2937'
  },
  dark: {
    name: 'Sombre',
    primary: '#60A5FA',
    background: '#1F2937',
    card: '#374151',
    text: '#F9FAFB'
  },
  coffee: {
    name: 'Café',
    primary: '#92400E',
    background: '#FEF3C7',
    card: '#FDE68A',
    text: '#78350F'
  }
};

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState('light');

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    setCurrentTheme(themeName);
    
    // Appliquer les variables CSS
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-background', theme.background);
    document.documentElement.style.setProperty('--color-card', theme.card);
    document.documentElement.style.setProperty('--color-text', theme.text);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('catchincup-theme', themeName);
  };

  return (
    <div className="relative">
      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Palette className="w-5 h-5 text-gray-600" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-2">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => applyTheme(key)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                currentTheme === key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                {key === 'light' && <Sun className="w-4 h-4" />}
                {key === 'dark' && <Moon className="w-4 h-4" />}
                {key === 'coffee' && <span className="text-sm">☕</span>}
                <span className="text-sm font-medium">{theme.name}</span>
              </div>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: theme.primary }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
