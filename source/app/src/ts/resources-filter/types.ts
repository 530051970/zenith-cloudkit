import { ColumnList } from '../common';

export interface ResourcesFilterProps {
  totalCount?: number;
  columnList?: Array<ColumnList>;
  className?: string;
  tableName?: string;
  query: any;
  setQuery: any;
  filteringPlaceholder?: string;
  isFreeText?: boolean;
}
