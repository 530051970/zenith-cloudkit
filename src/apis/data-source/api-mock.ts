import { apiRequest } from 'tools/apiRequest';

// 分页获取DataSource S3列表
const getDataSourceS3ByPage = async (params: any) => {
  const result = await apiRequest('post', 'data-source/list-s3', params);
  return result;
};

// 分页获取DataSource S3列表
const getDataSourceRdsByPage = async (params: any) => {
  const result = await apiRequest('post', 'data-source/list-rds', params);
  return result;
};

// S3连接
const connectDataSourceS3 = async (params: any) => {
  const result = await apiRequest('post', 'data-source/sync-s3', params);
  return result;
};

// rds连接
const connectDataSourceRDS = async (params: any) => {
  const result = await apiRequest('post', 'data-source/sync-rds', params);
  return result;
};

// 取消Rds连接
const disconnectDataSourceRDS = async (params: any) => {
  const result = await apiRequest('post', 'data-source/delete_rds', params);
  return result;
};

// 取消S3连接
const disconnectDataSourceS3 = async (params: any) => {
  const result = await apiRequest('post', 'data-source/delete_s3', params);
  return result;
};

// 获取SourceCoverage
const getSourceCoverage = async () => {
  // const result = await apiRequest('get', 'data-source/coverage', '');
  return {
    "s3_connected": 18,
    "s3_total": 29,
    "rds_connected": 1,
    "rds_total": 6
  };
};

const refreshDataSource = async (params: any) => {
  const result = await apiRequest('post', 'data-source/refresh', params);
  return result;
};

const getSecrets = async (params: any) => {
  const result = await apiRequest('get', 'data-source/secrets', params);
  return result;
};

export {
  getDataSourceS3ByPage,
  getDataSourceRdsByPage,
  connectDataSourceS3,
  connectDataSourceRDS,
  disconnectDataSourceRDS,
  disconnectDataSourceS3,
  getSourceCoverage,
  refreshDataSource,
  getSecrets,
};
