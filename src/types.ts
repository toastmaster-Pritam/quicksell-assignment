export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  score: number;
  lastMessageAt: Date;
  addedBy: string;
  avatar: string;
}

export type SortKey = keyof Pick<Customer, 'name' | 'email' | 'lastMessageAt' | 'addedBy' | 'score'> | 'id';
export type SortDirection = 'asc' | 'desc';

export type ScoreFilter = 'high' | 'medium' | 'low' | null;
export type DateFilter = 'recent' | 'older' | null;
export type AddedByFilter = string | null;
export type DomainFilter = string | null;

export interface FilterState {
  score: ScoreFilter;
  date: DateFilter;
  addedBy: AddedByFilter;
  domain: DomainFilter;
}