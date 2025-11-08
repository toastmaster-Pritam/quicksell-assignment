import React from 'react';

interface HeaderProps {
  customerCount: number;
}

export const Header: React.FC<HeaderProps> = ({ customerCount }) => {
  return (
    <div className="header">
     <img src='/Doubletick Logo.png' alt='logo' className='logo' height={40}/>
      <div className="tabs">
        <div className="tab">
          All Customers
          <span className="count-badge">{customerCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};