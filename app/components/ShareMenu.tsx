'use client';

import { useState, useRef, useEffect } from 'react';

export default function ShareMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: '👍',
      action: () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
      }
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        const url = window.location.href;
        const text = `Check out KATHIR LTD - Premium Wholesale Products: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Instagram',
      icon: '📸',
      action: () => {
        window.open('https://www.instagram.com/', '_blank');
      }
    },
    {
      name: 'Email',
      icon: '✉️',
      action: () => {
        const url = window.location.href;
        const subject = 'KATHIR LTD - Premium Wholesale Products';
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Check out this amazing website: ${url}`)}`;
      }
    },
    {
      name: 'Copy Link',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Three-Dot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 md:px-4 py-2.5 rounded-full font-bold transition-all duration-200 hover:shadow-lg flex items-center justify-center h-11 flex-shrink-0 shadow-md"
        style={{
          background: 'linear-gradient(135deg, #E8D4C4 0%, #D4B5A0 100%)',
          color: '#1F2937'
        }}
        title="Share"
      >
        ⋮
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium text-sm" style={{ color: '#1F2937' }}>
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
