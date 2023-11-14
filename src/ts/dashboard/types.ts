import { Props } from 'common/PropsModal';

export interface IAccountInfo {
  account_total: string | number;
  region_total: string | number;
}

export interface ISourceCoverage {
  s3_connected: number;
  s3_total: number;
  rds_connected: number;
  rds_total: number;
}

export type ColumnChartType = {
  classification: string;
  table_total: number;
  total_count: number;
};

export type ColumnChartData = {
  title: string;
  type: 'bar';
  valueFormatter: any;
  data: { x: string; y: number }[];
  color?: string;
};

export interface ICatalogSummary {
  database_total: number;
  object_total: number;
  size_total: number;
  column_chart: ColumnChartType[];
  instance_total: number;
  table_total: number;
  column_total: number;
}

export interface ITableListKeyValue {
  name: string;
  data_source_count: string | number;
  props?: Props[];
  category?: string;
  identifierLabel?: string;
}

export interface ITableDataType {
  account_top_n: ITableListKeyValue[];
  identifier_top_n: ITableListKeyValue[];
}

export interface IPrivacyPieChartType {
  instance_total: number;
  database_total: number;
  object_total: number;
  pii_table_total: number;
  privacy: number;
  size_total: number;
  table_total: number;
}

export interface IModifierChartType {
  data_sources: number;
  modifier: string;
  objects: number;
  size: number;
}

export interface IPieChartDataType {
  title: string;
  value: number;
  color?: string;
}

export interface IRegionDataType {
  database_total: number;
  object_total: number;
  pii_table_total: number;
  region: string;
  size_total: number;
  table_total: number;

  column_total: 67;
  instance_total: 1;
}
