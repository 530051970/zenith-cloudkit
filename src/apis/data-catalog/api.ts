import { apiRequest } from 'tools/apiRequest';

// 获取catalog弹窗 Folders/Tables列表
const getTablesByDatabase = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-tables-by-database',
    params
  );
  return result;
};

// 根据条件查询 catalog 弹窗, Folders/Tables 列表
const searchTablesByDatabase = async (params: any) => {
  const result = await apiRequest(
    'post',
    'catalog/search-tables-by-database',
    params
  );
  return result;
};

// 获取一个bucket/database 的Identifiers
const getDatabaseIdentifiers = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-database-identifiers',
    params
  );
  return result;
};

// 根据identifier获取Tables
const getTablesByDatabaseIdentifier = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-tables-by-database-identifier',
    params
  );
  return result;
};

// 更新database信息
const updateCatalogDatabase = async (params: any) => {
  const result = await apiRequest(
    'patch',
    'catalog/update-catalog-database',
    params
  );
  return result;
};

// 获取当前bucket/table有哪些列
const getColumnsByTable = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-columns-by-table',
    params
  );
  return result;
};
// 获取catalog主页面列表
const getDataBaseByType = async (params: any) => {
  const result = await apiRequest(
    'post',
    'catalog/list-databases-by-type',
    params
  );
  return result;
};

const getDataBaseByIdentifier = async (params: any) => {
  const result = await apiRequest(
    'post',
    'catalog/dashboard/get-database-by-identifier',
    params
  );
  return result;
};

// 更新table下的列信息
const updateCatalogColumn = async (params: any) => {
  const result = await apiRequest(
    'patch',
    'catalog/update-catalog-column',
    params
  );
  return result;
};

// 更新table信息
const updateCatalogTable = async (params: any) => {
  const result = await apiRequest(
    'patch',
    'catalog/update-catalog-table',
    params
  );
  return result;
};

// 获取S3 sample数据
const getS3SampleObjects = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-s3-sample-objects',
    params
  );
  return result;
};

// 获取rds sample数据
const getRdsTableSampleRecords = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-rds-table-sample-records',
    params
  );
  return result;
};

// 获取BucketProperty数据
const getBucketProperties = async (params: any) => {
  const result = await apiRequest(
    'get',
    'catalog/get-database-property',
    params
  );
  return result;
};

// updadate catalog labels
const updateCatalogLabels = async (params: {
  id: string | number;
  labels: string[];
}) => {
  const result = await apiRequest(
    'patch',
    'catalog/update-catalog-database-labels',
    params
  );
  return result;
};

// updadate table data labels
const updateCatalogTableLabels = async (params: {
  id: string | number;
  labels: string[];
}) => {
  const result = await apiRequest(
    'patch',
    'catalog/update-catalog-table-labels',
    params
  );
  return result;
};

const getExportS3Url = async (params: any) => {
  const result = await apiRequest(
    'get',
    `catalog/data_catalog_export_url/${params.fileType}/${params.timeStr}`,
    ''
  );
  return result;
};

const clearS3Object = async (timeStr: any) => {
  console.log("delete start s3Object name is: "+timeStr)
  const result = await apiRequest(
    'get',
    `catalog/clear_s3_object/${timeStr}`,
    ''
  );
  return result;
};

export {
  getTablesByDatabase,
  searchTablesByDatabase,
  getDatabaseIdentifiers,
  getTablesByDatabaseIdentifier,
  updateCatalogDatabase,
  getColumnsByTable,
  getDataBaseByType,
  updateCatalogColumn,
  updateCatalogTable,
  getS3SampleObjects,
  getRdsTableSampleRecords,
  getBucketProperties,
  getDataBaseByIdentifier,
  updateCatalogLabels,
  updateCatalogTableLabels,
  getExportS3Url,
  clearS3Object,
};
