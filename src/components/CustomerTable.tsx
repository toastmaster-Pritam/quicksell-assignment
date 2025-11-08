// src/components/CustomerTable.tsx
import React from 'react';
import type { Customer, SortDirection, SortKey } from '../types';
import { formatDate } from '../utils/formatters';

interface CustomerTableProps {
  containerRef: React.RefObject<HTMLDivElement>;
  visibleRecords: Customer[];
  sortBy: SortKey;
  dir: SortDirection;
  isLoading: boolean;
  viewCount: number;
  baseCount: number;
  activeFiltersCount: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  requestSort: (column: SortKey) => void;
  clearAllFilters: () => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  containerRef,
  visibleRecords,
  sortBy,
  dir,
  isLoading,
  viewCount,
  baseCount,
  activeFiltersCount,
  onScroll,
  requestSort,
  clearAllFilters,
}) => {

  const SortArrow = ({ column }: { column: SortKey }) => (
    <span className="sort">
      {sortBy === column ? (dir === 'asc' ? '▲' : '▼') : '↕'}
    </span>
  );

  return (
    <div className="card">
      {/* --- JSX FIX START HERE --- */}
      
      {/* 1. This new wrapper handles the HORIZONTAL scroll */}
      <div className="table-scroll-wrapper-x">
        
        {/* Table header */}
        <div className="thead row" role="row">
          <div className="th" style={{ paddingLeft: '16px' }}><input type="checkbox" /></div>
          <div className="th sortable" onClick={() => requestSort('name')}>
            Customer Name <SortArrow column="name" />
          </div>
          <div className="th sortable" onClick={() => requestSort('email')}>
            Email <SortArrow column="email" />
          </div>
          <div className="th sortable" onClick={() => requestSort('lastMessageAt')}>
            Last Message Sent At <SortArrow column="lastMessageAt" />
          </div>
          <div className="th sortable" onClick={() => requestSort('addedBy')}>
            Added By <SortArrow column="addedBy" />
          </div>
          <div className="th sortable" onClick={() => requestSort('score')}>
            Score <SortArrow column="score" />
          </div>
        </div>

        {/* 2. This container now ONLY handles VERTICAL scroll */}
        <div className="table-container" ref={containerRef} onScroll={onScroll}>
          <div className="tbody" role="rowgroup">
            {visibleRecords.map((rec) => (
              <div key={rec.id} className="row" role="row">
                <div className="td" style={{ paddingLeft: '16px' }}>
                  <input type="checkbox" aria-label={`Select customer ${rec.name}`} />
                </div>
                
                <div className="td namecell">
                  <img className="avatar" src={rec.avatar} alt="" />
                  <div>
                    <div className="name">{rec.name}</div>
                    <div className="phone">{rec.phone}</div>
                  </div>
                </div>

                <div className="td">{rec.email}</div>
                <div className="td muted">{formatDate(rec.lastMessageAt)}</div>
                <div className="td">{rec.addedBy}</div>
                <div className="td">
                  <span className="badge" title="Engagement score">⭐ {rec.score}</span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                ⏳ Loading next 30 rows...
              </div>
            )}
          </div>
        </div>
      </div> 
      {/* 3. End of new wrapper */}
      
      {/* --- JSX FIX END HERE --- */}


      {/* Footer */}
      <div className="foot">
        <span className="pill">
          Showing {viewCount.toLocaleString()} of {baseCount.toLocaleString()} rows
          {baseCount > viewCount ? ' · Scroll for more' : ''}
        </span>
        {activeFiltersCount > 0 && (
          <span className="pill clear-btn" onClick={clearAllFilters}>
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active · Clear All
          </span>
        )}
      </div>
    </div>
  );
};