import { apiRequest } from 'tools/apiRequest';

// 获取查询所有Labels
const requestGetAllLabels = async (params: { label_name: string }) => {
  const result: any = await apiRequest('get', `labels/search-labels`, params);
  return result;
};

// 获取查询分页labels
const getLabelsListByName = async (params: {
  page: number;
  size: number;
  label_name: string;
}) => {
  const result: any = await apiRequest(
    'post',
    `labels/search-detail-labels-by-page?page=${params.page}&size=${params.size}`,
    params
  );
  return result;
};

// 创建 Label
const requestCreateLabel = async (params: { label_name: string }) => {
  const result: any = await apiRequest('post', `labels/create-label`, params);
  return result;
};

// 删除 Label
const requestDeleteLabel = async (params: { ids: string[] }) => {
  const result: any = await apiRequest(
    'post',
    `labels/delete-labels-by-ids`,
    params
  );
  return result;
};

// 修改 Label
const requestUpdateLabel = async (params: {
  id: string;
  label_name: string;
}) => {
  const result: any = await apiRequest('post', `labels/update-label`, params);
  return result;
};

export {
  requestGetAllLabels,
  getLabelsListByName,
  requestCreateLabel,
  requestDeleteLabel,
  requestUpdateLabel,
};
