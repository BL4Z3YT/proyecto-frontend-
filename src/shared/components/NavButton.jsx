import React from 'react';

export default function NavButton({ active, onClick, children }) {
  return (
    <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}