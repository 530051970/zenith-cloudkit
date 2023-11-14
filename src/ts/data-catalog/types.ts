import { ColumnList } from 'ts/common';

export interface CatalogDetailListProps {
  tagId: string;
  catalogType: string;
  columnList: Array<ColumnList>; // column list
  detailTotalCount?: number; // data total count
  needFilter?: boolean; // need filter
  needByPage?: boolean; // need by page
  detailDesHeader?: string; // description header
  detailDesInfo?: string; // description info
  needSchemaModal?: boolean;
  selectRowData: any;
  clickTableCountProp?: any;
  clickIdentifiers?: string;
  selectPageRowData?: any;
  setSaveLoading?: any;
  setUpdateData?: any;
  previewDataList?: Array<any>;
  setSaveDisabled?: any;
  isFreeText?: boolean;
}

export interface Label {
  id: string;
  label_name: string;
}
