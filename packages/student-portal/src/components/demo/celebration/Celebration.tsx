import React from 'react';
import './celebration.css';

export function Celebration() {
  return (
    <div className="celebration-container">
      <div className="confetti">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="confetti-piece" style={{
            '--delay': `${Math.random() * 3}s`,
            '--rotation': `${Math.random() * 360}deg`,
            '--position': `${Math.random() * 100}%`,
          } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}