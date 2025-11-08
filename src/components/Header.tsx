// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  customerCount: number;
}

export const Header: React.FC<HeaderProps> = ({ customerCount }) => {
  return (
    <div className="header">
      <h1>DoubleTick</h1>
      <div className="tabs">
        <div className="tab">
          All Customers
          <span className="count-badge">{customerCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};