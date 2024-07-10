export type SortOrder = 'asc' | 'desc';

export type SortableHeaderProps = {
  field: string;
  label: string;
  sortBy: string;
  order: SortOrder;
  setSortBy: (field: string) => void;
  setOrder: (order: SortOrder) => void;
  isDisabled?: boolean
  width?: string;
}