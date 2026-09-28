import React from 'react';

export default function NecLogo({ className = "h-12", showSubtext = true }) {
  return (
    <div className={`nec-logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {/* SVG Icon */}
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {/* Lotus Petals */}
        <path d="M50 8 C46 22 36 32 20 38 C32 46 42 46 50 62 C58 46 68 46 80 38 C64 32 54 22 50 8 Z" fill="#7a1f7d" />
        <path d="M50 14 C47 26 40 34 28 40 C38 46 45 48 50 58 C55 48 62 46 72 40 C60 34 53 26 50 14 Z" fill="#93278f" />
        <path d="M22 28 C26 38 35 44 46 48 C36 50 30 56 22 66 C20 54 16 46 8 40 C14 36 18 32 22 28 Z" fill="#6a1a6d" />
        <path d="M78 28 C74 38 65 44 54 48 C64 50 70 56 78 66 C80 54 84 46 92 40 C86 36 82 32 78 28 Z" fill="#6a1a6d" />
        {/* Open Book in center */}
        <path d="M50 50 C44 45 36 46 30 48 L30 64 C36 62 44 61 50 66 C56 61 64 62 70 64 L70 48 C64 46 56 45 50 50 Z" fill="#ffffff" stroke="#7a1f7d" strokeWidth="2" />
        <path d="M50 50 L50 66" stroke="#7a1f7d" strokeWidth="2" />
        {/* Base Lotus Leaf Arc */}
        <path d="M20 68 C35 76 65 76 80 68 C72 74 62 78 50 78 C38 78 28 74 20 68 Z" fill="#d97706" />
        <circle cx="50" cy="85" r="4" fill="#7a1f7d" />
      </svg>

      {/* College Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ 
            fontFamily: 'serif', 
            fontWeight: '900', 
            fontSize: '1.4rem', 
            color: '#6b1d6b', 
            letterSpacing: '0.5px' 
          }}>
            NEC
          </span>
          <span style={{ 
            fontFamily: 'serif', 
            fontWeight: '800', 
            fontSize: '1.25rem', 
            color: '#7a1f7d', 
            letterSpacing: '1px' 
          }}>
            NARASARAOPETA
          </span>
        </div>
        <div style={{ 
          fontFamily: 'serif', 
          fontWeight: '700', 
          fontSize: '0.98rem', 
          color: '#334155', 
          letterSpacing: '1.8px',
          borderBottom: '1.5px solid #6b1d6b',
          paddingBottom: '2px',
          marginTop: '1px'
        }}>
          ENGINEERING COLLEGE
        </div>
        {showSubtext && (
          <div style={{ 
            fontSize: '0.74rem', 
            fontWeight: '700', 
            color: '#1e40af', 
            letterSpacing: '2.5px',
            textAlign: 'center',
            paddingTop: '2px'
          }}>
            (AUTONOMOUS)
          </div>
        )}
      </div>
    </div>
  );
}
