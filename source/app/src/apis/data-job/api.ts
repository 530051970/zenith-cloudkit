import { apiRequest } from 'tools/apiRequest';

// 分页获取Discovery Job
const getDiscoveryJobs = async (params: any) => {
  const result = await apiRequest('post', 'discovery-jobs/list-jobs', params);
  return result;
};

// 获取单个job详情
const getJobDetail = async (params: any) => {
  const result = await apiRequest('get', 'discovery-jobs/' + params.id, '');
  return result;
};

// 获取job运行历史
const getJobRunHistory = async (params: any) => {
  const result = await apiRequest(
    'get',
    `discovery-jobs/${params.id}/runs`,
    params
  );
  return result;
};

const getReportS3Url = async (params: any) => {
  const result = await apiRequest(
    'get',
    `discovery-jobs/${params.id}/runs/${params.runId}/report_url`,
    ''
  );
  return result;
};

const getJobTemplateUrl = async (params: any) => {
  const result = await apiRequest(
    'get',
    `discovery-jobs/${params.id}/runs/${params.runId}/template_snapshot_url`,
    ''
  );
  return result;
};

const disableJob = async (params: any) => {
  const result = await apiRequest(
    'post',
    `discovery-jobs/${params.id}/disable`,
    ''
  );
  return result;
};

const startJob = async (params: any) => {
  const result = await apiRequest(
    'post',
    `discovery-jobs/${params.id}/start`,
    ''
  );
  return result;
};

const stopJob = async (params: any) => {
  const result = await apiRequest(
    'post',
    `discovery-jobs/${params.id}/stop`,
    ''
  );
  return result;
};

const createJob = async (params: any) => {
  const result = await apiRequest('post', 'discovery-jobs', params);
  return result;
};

const getGuleJobList = async (params: any) => {
  const result = await apiRequest(
    'get',
    `discovery-jobs/${params.id}/runs/${params.runId}`,
    params
  );
  return result;
};

const getGuleJobDetailList = async (params: any) => {
  const result = await apiRequest(
    'post',
    `discovery-jobs/${params.id}/runs/${params.runId}/databases`,
    params
  );
  return result;
};

const getGuleJobStatus = async (params: any) => {
  const result = await apiRequest(
    'get',
    `discovery-jobs/${params.id}/runs/${params.runId}/status`,
    params
  );
  return result;
};

const enableJob = async (params: any) => {
  const result = await apiRequest(
    'post',
    `discovery-jobs/${params.id}/enable`,
    ''
  );
  return result;
};

const requestJobProgress = async (params: {
  id: string;
  run_id: string;
  run_database_id: string;
}) => {
  const result = await apiRequest(
    'get',
    `/discovery-jobs/${params.id}/runs/${params.run_id}/${params.run_database_id}/progress`,
    ''
  );
  return result as any;
};

const batchrequestJobProgress = async (params: {
  id: string;
  run_id: string;
}) => {
  const result = await apiRequest(
    'get',
    `/discovery-jobs/${params.id}/runs/${params.run_id}/progress`,
    ''
  );
  return result as any;
};

export {
  getDiscoveryJobs,
  getJobDetail,
  getJobRunHistory,
  getReportS3Url,
  disableJob,
  startJob,
  stopJob,
  createJob,
  getGuleJobList,
  getGuleJobDetailList,
  enableJob,
  getGuleJobStatus,
  getJobTemplateUrl,
  requestJobProgress,
  batchrequestJobProgress,
};
