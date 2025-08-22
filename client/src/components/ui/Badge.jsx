// src/components/ui/Badge.jsx
import React from 'react';

const Badge = ({ children, className = '' }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default Badge;
