// src/components/Dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string | null;
  label: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  value: string | null;
  onSelect: (value: string | null) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown${isOpen ? ' open' : ''}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={value ? 'active' : ''}>
        {value ? `${label}: ${selectedLabel}` : label}
        <span style={{ opacity: 0.6 }}>▾</span>
      </button>
      <div className="menu">
        {options.map(option => (
          <div
            key={option.value || 'all'}
            className={`item${option.value === value ? ' active' : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};