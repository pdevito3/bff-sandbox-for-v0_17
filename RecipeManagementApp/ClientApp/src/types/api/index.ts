export interface PagedResponse<T> {
  pagination: Pagination;
  data: T[];
}

export interface Pagination {
  currentEndIndex: number;
  currentPageSize: number;
  currentStartIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type WraptSortDirection = 'asc' | 'desc';
export type WraptColumnSort = {
    id: string;
    desc: boolean;
};
export type WraptSortingState = WraptColumnSort[];