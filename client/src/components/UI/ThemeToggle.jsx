import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div 
      onClick={toggleTheme}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? 'var(--bg-tertiary)' : '#cbd5e1',
        padding: '8px',
        borderRadius: '50%',
        width: '46px',
        height: '46px',
        transition: 'all 0.3s ease',
        boxShadow: isDark ? 'inset 0 0 10px rgba(0,0,0,0.5)' : 'inset 0 0 8px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
      title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
    >
      <svg 
         viewBox="0 0 100 100" 
         width="32" 
         height="32" 
         style={{ transition: 'all 0.4s ease' }}
      >
        {/* Owl Body */}
        <path d="M 20 60 C 20 20, 80 20, 80 60 L 80 80 C 80 90, 70 100, 50 100 C 30 100, 20 90, 20 80 Z" 
              fill={isDark ? "var(--accent-primary)" : "#64748b"} 
              style={{ transition: 'fill 0.4s ease' }}/>
        
        {/* Owl Ears */}
        <path d="M 20 40 L 10 10 L 40 25 Z" fill={isDark ? "var(--accent-primary)" : "#64748b"} style={{ transition: 'fill 0.4s ease' }} />
        <path d="M 80 40 L 90 10 L 60 25 Z" fill={isDark ? "var(--accent-primary)" : "#64748b"} style={{ transition: 'fill 0.4s ease' }} />

        {/* Eyes (Outer stroke / Glasses) */}
        <circle cx="35" cy="50" r="14" fill={isDark ? "#ffffff" : "#f1f5f9"} />
        <circle cx="65" cy="50" r="14" fill={isDark ? "#ffffff" : "#f1f5f9"} />

        {/* Dynamic Eye States */}
        {isDark ? (
           <>
              {/* Wide awake eyes */}
              <circle cx="35" cy="50" r="6" fill="#0f111a" />
              <circle cx="65" cy="50" r="6" fill="#0f111a" />
              <circle cx="37" cy="48" r="2" fill="#ffffff" />
              <circle cx="67" cy="48" r="2" fill="#ffffff" />
           </>
        ) : (
           <>
              {/* Sleeping curves */}
              <path d="M 25 50 Q 35 60 45 50" stroke="#0f111a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 55 50 Q 65 60 75 50" stroke="#0f111a" strokeWidth="3" fill="none" strokeLinecap="round" />
           </>
        )}
        
        {/* Beak */}
        <path d="M 45 60 L 50 70 L 55 60 Z" fill="#f59e0b" />
      </svg>

      {/* Weather Sparkles */}
      <div style={{
         position: 'absolute',
         top: '-2px', right: '-2px',
         fontSize: '12px',
         opacity: isDark ? 1 : 0,
         transform: isDark ? 'scale(1)' : 'scale(0)',
         transition: 'all 0.3s ease'
      }}>✨</div>
    </div>
  );
};

export default ThemeToggle;
