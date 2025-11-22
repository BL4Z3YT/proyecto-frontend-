import React from 'react';

export default function Body({ children }) {
  return (
    <main className="main">
      <div className="container" style={{ display: 'block' }}>
        {children}
      </div>
    </main>
  );
}