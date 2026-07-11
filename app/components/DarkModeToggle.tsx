'use client';

import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from './DarkModeProvider';

const modes = [
  { value: 'light', icon: '☀️', label: 'Light' },
  { value: 'dark', icon: '🌙', label: 'Dark' },
  { value: 'system', icon: '🖥️', label: 'System' },
];

export default function DarkModeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mode, isDark, setMode } = useDarkMode();

  // Combined effect: set mounted and handle click outside
  useEffect(() => {
    setMounted(true);

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef} style={{ visibility: mounted ? 'visible' : 'hidden' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Theme"
      >
        {isDark ? '🌙' : '☀️'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && mounted && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
          <div className="p-2">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => {
                  setMode(m.value as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  mode === m.value
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span>{m.label}</span>
                {mode === m.value && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
