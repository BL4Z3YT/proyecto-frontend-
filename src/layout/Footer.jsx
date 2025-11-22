import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ justifyContent: 'center' }}>
        <small>GameTracker · Proyecto final · {new Date().getFullYear()}</small>
      </div>
    </footer>
  );
}