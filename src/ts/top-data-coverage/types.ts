export interface TopDataCoverageProps {
  header: string;
  description?: React.ReactNode;
  leftChildHeader: string;
  rightChildHeader: string;
  leftChildData: string;
  rightChildData: string;
  leftChildTotal?: number | string;
  rightChildTotal?: number | string;
  isRowMore?: boolean;
}
