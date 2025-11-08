// src/hooks/useCustomers.ts
import { useMemo, useState, useEffect } from 'react';
import type { Customer, FilterState, SortDirection, SortKey } from '../types';
import { firstNames, lastNames, domains, addedByList } from '../utils/data';
import { formatPhone } from '../utils/formatters';
import { lcg, hash32 } from '../utils/generators';

const TOTAL = 1_000_000; // Total number of customer records

/**
 * Generates a deterministic customer record based on index
 */
function recordByIndex(i: number): Customer {
  const seed = hash32(i + 1234567);
  const rnd = lcg(seed);
  const f = firstNames[rnd() % firstNames.length];
  const l = lastNames[rnd() % lastNames.length];
  const name = `${f} ${l}`;
  const id = i + 1;
  const raw = 6000000000 + (rnd() % 3000000000);
  const phone = formatPhone(raw);
  const email = `${f.toLowerCase()}.${l.toLowerCase()}${rnd() % 1000}@${domains[rnd() % domains.length]}`;
  const score = rnd() % 1000;
  const now = Date.now();
  const days = rnd() % 730; // Random date within last 2 years
  const lastMessageAt = new Date(now - days * 86400000 - (rnd() % 86400000));
  const addedBy = addedByList[rnd() % addedByList.length];
  const hue = rnd() % 360;
  const initials = (f[0] + l[0]).toUpperCase();
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${hue},70%,55%)'/><stop offset='100%' stop-color='hsl(${(hue + 40) % 360},70%,45%)'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='56%' text-anchor='middle' font-family='Inter,Arial' font-size='28' fill='rgba(255,255,255,.92)' font-weight='700'>${initials}</text></svg>`);
  const avatar = `data:image/svg+xml;charset=UTF-8,${svg}`;
  return { id, name, phone, email, score, lastMessageAt, addedBy, avatar };
}

/**
 * Checks if a record passes all active filters
 */
const passesFilters = (rec: Customer, filters: FilterState, debouncedQuery: string): boolean => {
  // Search filter
  if (debouncedQuery) {
    const s = debouncedQuery.toLowerCase();
    const matches = rec.name.toLowerCase().includes(s) ||
      rec.email.toLowerCase().includes(s) ||
      rec.phone.includes(s);
    if (!matches) return false;
  }

  // Score filter
  if (filters.score === 'high' && rec.score < 700) return false;
  if (filters.score === 'medium' && (rec.score < 400 || rec.score >= 700)) return false;
  if (filters.score === 'low' && rec.score >= 400) return false;

  // Date filter
  if (filters.date) {
    const daysDiff = (Date.now() - rec.lastMessageAt.getTime()) / (1000 * 60 * 60 * 24);
    if (filters.date === 'recent' && daysDiff > 30) return false;
    if (filters.date === 'older' && daysDiff <= 30) return false;
  }

  // Added by filter
  if (filters.addedBy && rec.addedBy !== filters.addedBy) return false;

  // Domain filter
  if (filters.domain) {
    const domain = rec.email.split('@')[1];
    if (domain !== filters.domain) return false;
  }

  return true;
};

export const useCustomers = (
  filters: FilterState,
  debouncedQuery: string,
  sortBy: SortKey,
  dir: SortDirection
) => {
  const [allRecords, setAllRecords] = useState<Customer[]>([]);

  // Generate all records on mount
  useEffect(() => {
    const records: Customer[] = [];
    for (let i = 0; i < TOTAL; i++) {
      records.push(recordByIndex(i));
    }
    setAllRecords(records);
  }, []);

  // Memoize filtered and sorted records
  const filteredRecords = useMemo(() => {
    // Apply filters
    let records = allRecords.filter(rec => passesFilters(rec, filters, debouncedQuery));

    // Apply sorting
    if (sortBy !== 'id') {
      records = [...records].sort((a, b) => {
        let va: string | number, vb: string | number;

        if (sortBy === 'name') { va = a.name; vb = b.name; }
        else if (sortBy === 'email') { va = a.email; vb = b.email; }
        else if (sortBy === 'score') { va = a.score; vb = b.score; }
        else if (sortBy === 'lastMessageAt') { va = a.lastMessageAt.getTime(); vb = b.lastMessageAt.getTime(); }
        else if (sortBy === 'addedBy') { va = a.addedBy; vb = b.addedBy; }
        else { return 0; }

        if (va < vb) return dir === 'asc' ? -1 : 1;
        if (va > vb) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return records;
  }, [allRecords, filters, debouncedQuery, sortBy, dir]);

  return { allRecords, filteredRecords };
};