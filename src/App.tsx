import React, { useEffect, useRef, useState} from 'react';
import type { FilterState, SortDirection, SortKey } from './types';
import { useCustomers } from './hooks/useCustomers';
import { useDebounce } from './hooks/useDebounce';
import "./index.css";
import { Header } from './components/Header';
import { CustomerTable } from './components/CustomerTable';
import { Dropdown } from './components/Dropdown';
import { domains, addedByList } from './utils/data';

// Filter options
const scoreOptions = [
  { value: null, label: 'All Scores' },
  { value: 'high', label: 'High (700+)' },
  { value: 'medium', label: 'Medium (400-699)' },
  { value: 'low', label: 'Low (<400)' },
];
const dateOptions = [
  { value: null, label: 'All Dates' },
  { value: 'recent', label: 'Recent (30 days)' },
  { value: 'older', label: 'Older (>30 days)' },
];
const addedByOptions = [
  { value: null, label: 'All Users' },
  ...addedByList.map(name => ({ value: name, label: name })),
];
const domainOptions = [
  { value: null, label: 'All Domains' },
  ...domains.map(domain => ({ value: domain, label: domain })),
];


export default function App() {

  const [loaded, setLoaded] = useState(30);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("id");
  const [dir, setDir] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    score: null,
    date: null,
    addedBy: null,
    domain: null,
  });

  const containerRef = useRef<HTMLDivElement>(null!);
  const debouncedQuery = useDebounce(query.trim(), 250);

  const { filteredRecords } = useCustomers(filters, debouncedQuery, sortBy, dir);

  // Reset to first 30 rows when filters/search/sort changes
  useEffect(() => {
    setLoaded(30);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [filters, debouncedQuery, sortBy, dir]);

  // Calculate counts
  const baseCount = filteredRecords.length;
  const viewCount = Math.min(loaded, baseCount);
  const visibleRecords = filteredRecords.slice(0, viewCount);
  const activeFiltersCount = Object.values(filters).filter(f => f !== null).length;

  const clearAllFilters = () => {
    setFilters({ score: null, date: null, addedBy: null, domain: null });
  };

  const requestSort = (column: SortKey) => {
    const newDir = (sortBy === column && dir === 'asc') ? 'desc' : 'asc';
    setSortBy(column);
    setDir(newDir);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (scrollBottom < 100 && !isLoading && loaded < baseCount) {
      setIsLoading(true);
      setTimeout(() => {
        setLoaded(n => Math.min(n + 30, baseCount));
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <div className="wrap">
      <Header customerCount={baseCount} />
      
      {/* Toolbar: Search and Filters */}
      <div className="toolbar">
        <div className="searchbar">
          {/* <span className="icon">🔎</span> */}
          <img src='/test_Search-3.svg' alt='search icon' className='icon' />
          <input
            placeholder="Search Customers"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="filters">
          <Dropdown
            label="Score"
            options={scoreOptions}
            value={filters.score}
            onSelect={(val) => setFilters(f => ({ ...f, score: val as FilterState['score'] }))}
          />
          <Dropdown
            label="Date"
            options={dateOptions}
            value={filters.date}
            onSelect={(val) => setFilters(f => ({ ...f, date: val as FilterState['date'] }))}
          />
          <Dropdown
            label="Added By"
            options={addedByOptions}
            value={filters.addedBy}
            onSelect={(val) => setFilters(f => ({ ...f, addedBy: val }))}
          />
          <Dropdown
            label="Domain"
            options={domainOptions}
            value={filters.domain}
            onSelect={(val) => setFilters(f => ({ ...f, domain: val }))}
          />
        </div>
      </div>

      {/* Main table card */}
      <CustomerTable
        containerRef={containerRef}
        visibleRecords={visibleRecords}
        sortBy={sortBy}
        dir={dir}
        isLoading={isLoading}
        viewCount={viewCount}
        baseCount={baseCount}
        activeFiltersCount={activeFiltersCount}
        onScroll={handleScroll}
        requestSort={requestSort}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
}