export interface IFilter {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: string;
  sorting: string;
}

export interface IPaginatedList<T> {
  totalPages: number;
  items: T[];
}

export interface ISortOption {
  id: number;
  name: string;
  label: string;
}
